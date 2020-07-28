---
layout: post
title:  "Running NASM inside C inside GDB. Part 2. More arguments"
date:   2016-12-08
tags: ["nasm", "c", "gdb"]
---

In previous post [Running NASM inside C inside GDB. Part 1. Integers]({{ site.baseurl }}{% link _posts/2016-12-07-nasm-c-gdb.md %}) we created a simple `asm` function and called it from `C` code.

We had only 3 arguments in that example. But what happens if we have more? `Stack` happens.


# More numeric calculations

Let's create another `C` program that will invoke external function with 8 arguments:

{% highlight c %}
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <inttypes.h>

extern uint64_t asm_compute_more(uint64_t n1, uint64_t n2, uint64_t n3, uint64_t n4, uint64_t n5, uint64_t n6, uint64_t n7, uint64_t n8);

int main(int argc, char* argv[]) {
  if (argc < 9) {
    printf("Not enough arguments.\nUsage: %s [n1] [n2] [n3]\n", argv[0]);
    return EXIT_FAILURE;
  }

  int64_t n1 = strtoull(argv[1], NULL, 10);
  int64_t n2 = strtoull(argv[2], NULL, 10);
  int64_t n3 = strtoull(argv[3], NULL, 10);
  int64_t n4 = strtoull(argv[4], NULL, 10);
  int64_t n5 = strtoull(argv[5], NULL, 10);
  int64_t n6 = strtoull(argv[6], NULL, 10);
  int64_t n7 = strtoull(argv[7], NULL, 10);
  int64_t n8 = strtoull(argv[8], NULL, 10);

  int64_t result = asm_compute_more(n1, n2, n3, n4, n5, n6, n7, n8);
  printf("asm_compute(%lld, %lld, %lld, %lld, %lld, %lld, %lld, %lld) = %lld\n",
      n1, n2, n3, n4, n5, n6, n7, n8, result);

  return EXIT_SUCCESS;
}
{% endhighlight %}

Okay, we have more than 3 parameters now. How are those passed to the external `asm_compute_more`?

### Disassamble call

`gcc -S num_calc_more.c` would give us `num_calc_more.s` to see how the arguments were handled:

{% highlight nasm %}
    movq    %rax, -88(%rbp)
    movq    -32(%rbp), %rdi     ;n1
    movq    -40(%rbp), %rsi     ;n2
    movq    -48(%rbp), %rdx     ;n3
    movq    -56(%rbp), %rcx     ;n4
    movq    -64(%rbp), %r8      ;n5
    movq    -72(%rbp), %r9      ;n6
    movq    -80(%rbp), %rax     ;n7
    movq    -88(%rbp), %r10     ;n8
    movq    %rax, (%rsp)        ;n7 [stack pointer]
    movq    %r10, 8(%rsp)       ;n8 [stack pointer + 8]
    callq   _asm_compute_more
{% endhighlight %}

We can easily cross-check this with the [Calling Conventions](https://en.wikipedia.org/wiki/X86_calling_conventions) to see that `gcc` placed all arguments into registers, but also pushed last two (`n7`, `n8` to the stack).

Ok, so if we are sure we would only run on this architecture with this compiler, it's fine, we can just use registers only and forget about the stack. But let's not do this for now, and use stack.

Notice offset `8` here, it is equal to the size of our operand: `64bit`

## Initialize stack

See some examples here: [Calling Convention Examples](https://en.wikibooks.org/wiki/X86_Disassembly/Calling_Convention_Examples).

In order to use arguments, passed via stack, we should initialize the stack pointer:
```asm
  ; stdcall save stack pointer
  push rbp        
  mov rbp, rsp     

  ; do your stuff
  ; and restore base pointer

  pop rbp         ; restore stack pointer
```

Now we can access our values as follows:
{% highlight nasm %}
  ; mov eax, rdi       ; 1st arg  n1
  ; mov eax, rsi       ; 2nd arg  n2
  ; mov eax, rdx       ; 3rd arg  n3
  ; mov eax, rcx       ; 4th arg  n4
  ; mov eax, r8        ; 5th arg  n5
  ; mov eax, r9        ; 6th arg  n6
  ; mov eax, [rbp+16]  ; 7th arg  n7
  ; mov eax, [rbp+24]  ; 8th arg  n8
{% endhighlight %}


## Calculations

Let's do something even more useful here: `n1 + n2 - n3 + n4 - n5 + n6 - n7 + n8`

{% highlight nasm %}
global _asm_compute_more

section .text

; n1 + n2 - n3 + n4 - n5 + n6 - n7 + n8

; rdi       ; 1st arg  n1
; rsi       ; 2nd arg  n2
; rdx       ; 3rd arg  n3
; rcx       ; 4th arg  n4
; r8        ; 5th arg  n5
; r9        ; 6th arg  n6
; [rbp+16]  ; 7th arg  n7
; [rbp+24]  ; 8th arg  n8
_asm_compute_more:
  push rbp
  mov rbp, rsp

  add rdi, rsi        ; rdi = n1 + n2
  sub rdi, rdx        ; rdi = n1 + n2 - n3
  add rdi, rcx        ; rdi = n1 + n2 - n3 + n4
  sub rdi, r8         ; rdi = n1 + n2 - n3 + n4 - n5
  add rdi, r9         ; rdi = n1 + n2 - n3 + n4 - n5 + n6
  sub rdi, [rbp+16]   ; rdi = n1 + n2 - n3 + n4 - n5 + n6 - n7
  add rdi, [rbp+24]   ; rdi = n1 + n2 - n3 + n4 - n5 + n6 - n7 + n8

  mov rax, rdi        ; copy return value to rax

  pop rbp
  ret
{% endhighlight %}


## Compile

{% highlight bash %}
nasm -f macho64 num_calc_more.asm            # will produce num_calc_more.o
gcc -Wall -o num_calc_more num_calc_more.c num_calc_more.o   # will compile num_calc_more.c and link compiled asm code
{% endhighlight %}

Test if it is workign:
{% highlight bash %}
$ ./num_calc_more 1 2 3 4 5 6 7 8 
asm_compute_more(1, 2, 3, 4, 5, 6, 7, 8) = 6
{% endhighlight %}

Great, seems like it is doing something useless, but doing it right ;)


Continue reading here: [Running NASM inside C inside GDB. Part 3. Debugging]({{ site.baseurl }}{% link _posts/2016-12-09-nasm-c-gdb.md %})

---
Source code on github: [nasm-c-gdb](https://github.com/lotas/nasm-c-gdb)

