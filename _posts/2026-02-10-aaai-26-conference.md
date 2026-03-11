---
layout: post
title: "AAAI 2026 Conference"
date: 2026-02-10
tags: ["machine learning", "AI", "llm", "conference", "agents", "thoughts"]
---

I learned about [AAAI-26](https://aaai.org/conference/aaai/aaai-26/) and what AAAI was just few weeks before the conference.

The agenda was packed with research-heavy talks, but despite being a software engineer, I was intrigued.
Everyone is trying to slap "AI" label on everything nowadays, so I decided to see the real thing for myself. 

It is fair to say that my expectations were exceeded, I wanted to learn what kind of research academia is focusing on, where the frontier of development headed, and how I can apply those findings to my own work.

The full list of topics was so vast that I gave up picking individual talks and decided to discover them by category as I went. 
For this conference, they had approximately 40.000+ papers submitted, with about 4000 accepted. Of those, 1058 were selected for oral presentations, while the rest were relegated to poster-only sessions.

The first thing that stood out to me was that LLMs and AGI were not the most dominant topics! It was a stark contrast to the media narrative and the CEOs constantly claiming "AGI is around the corner".

Based on number of talks, the largest categories were:

- Computer vision: diffusion models, 3D reconstruction, vision-language models.
- Machine learning: reinforcement learning, graph neural networks, trustworthy AI, optimization.
- Natural Language Processing: large language models, reasoning/chain-of-thought, alignment, safety/hallucinations and agents.

{% include gallery.html gallery="aaai-26-opening" %}

### My key takeaways

- **Research vs. hype**: it was a true research conference where every claim had to be verified - it’s much harder to "bullshit" here. This was a refreshing contrast to dev or product conferences, where almost every talk is an open or covert sales pitch.
- **Global presence**: the research landscape is heavily influenced by China. While researchers came from all over the world, Chinese institutions had a massive, dominant presence.
- **The LLM minority**: despite the public narrative, LLMs were only a tiny fraction of the conference. Computer Vision was arguably the largest track, which was an eye-opening reality check compared to the mainstream AI discourse.
- **AGI reality check**: contrary to the "AGI is imminent" FUD, the conference made it clear there is still a mountain of fundamental research and breakthroughs ahead of us.
- **Rigorous incrementalism**: every paper strives to improve a specific benchmark. It’s a culture of incremental, rigorous progress rather than just "magic" breakthroughs.
- **Ablation studies**: I loved the concept of ablation studies - systematically removing parts of a solution to see if they were actually necessary. It’s a scientific way to kill over-engineering, and a concept software engineers should definitely use more.
- **The knowledge gap**: it's tough to communicate deeply with researchers without significant domain knowledge. There's a high barrier to entry for these conversations.


{% include gallery.html gallery="aaai-26-demos" %}

### AI agents & computer use

> "Your scientists were so preoccupied with whether or not they could, they didn't stop to think if they should".

This quote feels particularly apt for a certain company building a "popular gaming OS". 
Microsoft seems to be investing so heavily in making Linux the superior desktop choice that it’s almost impressive. /s

Sarcasm aside, they have developed several high-quality projects in this space:

* **[Microsoft Fara-7B](https://github.com/microsoft/fara):** A purpose-built, efficient agentic model for "computer use." Despite its small size (7B parameters), it’s specifically fine-tuned to navigate interfaces and execute desktop tasks.
* **[Microsoft OmniParser](https://github.com/microsoft/omniparser):** A vision-based screen parsing tool. It acts as a foundational layer that "sees" a GUI, identifying interactable elements (buttons, icons, text fields) so an agent knows exactly what’s on screen before trying to act.
* **[Microsoft Magentic-UI](https://github.com/microsoft/magentic-ui):** A research prototype for human-centered web agents. It focuses on the "human-in-the-loop" experience, allowing users to collaborate with the agent rather than just watching it work.
* **[Microsoft AutoGen](https://github.com/microsoft/autogen):** Their flagship framework for building multi-agent systems. It allows multiple specialized agents to "talk" to each other to solve complex tasks that a single model might struggle with.


{% include gallery.html gallery="aaai-26-talks" %}

### Time series & forecasting

This was a surprisingly active area, with Transformers and Vision-Language Models (VLMs) being applied to time series data in clever ways. 
My primary interest here was exploring how to predict Taskcluster task runtimes at scale.

- [GraFT](https://github.com/yuanyumi/graft) - this project uses pre-trained Transformers combined with a graph-based relational structure. It’s particularly effective for forecasting when your data points have complex dependencies on each other
- ["Harnessing Vision-Language Models for Time Series Anomaly Detection"](https://arxiv.org/pdf/2506.06836) - this was a fascinating example of cross-pollination. It applies visual models to non-visual data, essentially "teaching" a VLM to recognize patterns and outliers in a time series as if it were looking at a geometric shape.
- [ETS State Space Models](https://www.openforecast.org/adam/state-space-form-of-ets.html) - a great "sanity check" against the AI hype. These represent classical statistical forecasting (Error, Trend, Seasonal). Including these provided a necessary contrast to the neural-network-heavy talks, reminding everyone that sometimes "old school" math is still the most efficient tool for the job.


{% include gallery.html gallery="aaai-26-posters" %}

### Foundational concepts

I realized I was a bit behind on some of the latest techniques used in modern ML. Here are the core concepts and ideas I had to research to fully grasp some of the talks:

- [Graph Neural Networks](https://en.wikipedia.org/wiki/Graph_neural_network) - these apply neural networks to graph-structured data (nodes and edges). They are incredibly "hot" right now because they excel at modeling relationships. Some examples: social network analysis, molecular structure discovery (drug design), and recommendation engines (mapping users to products).
- [Vision Transformers (ViT)](https://en.wikipedia.org/wiki/Vision_transformer) - This involves applying the Transformer architecture-originally for text—to-images. *Key insight:* ViT splits an image into patches and treats them like tokens in a sentence. By turning these patches into embeddings, text and images finally speak the same language, which is the secret sauce behind multimodal models.
- [Vision-Language Models](https://en.wikipedia.org/wiki/Vision-language_model) - models trained to understand both images and text simultaneously, allowing you to chat about a picture or generate descriptions from a video.
- [Recurrent Neural Networks](https://en.wikipedia.org/wiki/Recurrent_neural_network) - these are networks with memory designed for sequential data. They *were* the standard for next-token prediction before transformers took over. Today, they are mostly used in specific niche applications or combined with other architectures where long-range context isn't the priority.
- [Reinforcement Learning](https://en.wikipedia.org/wiki/Reinforcement_learning) - a framework where an agent learns to make decisions by trial and error, receiving rewards or penalties based on its actions. This is the core of how models like AlphaGo or specialized robotics agents function.
- [Gradient Boosting](https://en.wikipedia.org/wiki/Gradient_boosting) - an ensemble method where multiple weak models (usually decision trees) are built sequentially, with each new model focusing on correcting the errors of the previous ones. It’s still a powerhouse for tabular data.


### Tools, resources and personalities

I walked away from the conference with a list of interesting people to follow and tools to explore:

- [Peter Stone (AAAI President)](https://www.cs.utexas.edu/~pstone/teaching.shtml) - delivered a fascinating talk on autonomous robots playing soccer - classic but still incredibly challenging benchmark for multi-agent coordination.
- [Daniel Whiteson](https://en.wikipedia.org/wiki/Daniel_Whiteson) - a brilliant physicists and ML scientist. He has a gift for making complex science accessible through his talks, books and podcasts:
    - ["We Have No Idea" by Cham & Whiteson](https://www.amazon.com/We-Have-No-Idea-Everything/dp/037453355X) - a fun illustrated book about everything we don't know about the universe
- [Transformer Explainer (Georgia Tech)](https://poloclub.github.io/transformer-explainer/) - an incredible interactive transformer visualization. Great for building intuition if you struggled to visualise how attention mechanism works.
- [OpenAI PRM800K](https://github.com/openai/prm800k) - a dataset of 800k step-level correctness labels for LLM math solutions. This is a gold standard for training models to reason through problems step-by-step.
- [Underline](https://underline.io/library/search?subject_subtree_of_id=26) - hosts recorded lectures and presentations from AAAI and other major conferences.
- [State of AI in Business 2025 report](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf) - a grounded reality check on where AI adoption actually stands in the corporate world.


### Comparison to the pre-ChatGPT era:

I was curious to check what topics dominated AAAI in the past: (disclaimer: I used llm to analyze past trends)

**The "Classical & Optimization" Era (2014–2016)**

Before the total Deep Learning takeover, AAAI was heavily focused on theoretical guarantees, decision-making, and economic systems.
* Dominant theme: Game Theory & Economic Paradigms (GTEP). If you walked into AAAI in 2015, you would hear endless talk about Auctions, Mechanism Design, and Voting Theory.
* Hot topic: Security Games. This was a massive sub-field (often led by researchers like Milind Tambe) focused on using game theory to schedule security patrols for airports or wildlife protection.
* Other major topics: Heuristic Search (A*), Constraint Satisfaction (SAT solvers), and Planning. Deep Learning was present (CNNs), but it was just one tool in the shed, not the entire shed.

Snapshot of 2015 Keywords: Mechanism Design, Combinatorial Auctions, Social Choice, Satisfiability (SAT), Markov Decision Processes.
    

**The "Deep Learning & Structure" Boom (2017–2019)**

This period saw the birth of the Transformer (late 2017), but it hadn't yet eclipsed other architectures. The community was obsessed with making neural networks work on "structured" data.

* Dominant Theme: Reinforcement Learning (RL) & Graphs. Following AlphaGo's success, everyone wanted to apply RL to everything—finance, robotics, and games.
* Graph Neural Networks (GNNs): Before Transformers took over, GNNs were the "next big thing." Researchers were trying to make deep learning work on non-Euclidean data like social networks and molecules.
* The "Adversarial" Hype: This was the era of GANs (Generative Adversarial Networks) and Adversarial Attacks. Papers were obsessed with either "tricking" classifiers with noise or generating the first decent-looking AI faces.

Snapshot of 2018 Keywords: Deep Reinforcement Learning, Adversarial Examples, Graph Convolutional Networks, GANs, LSTM-based Translation.

**The "Pre-ChatGPT" Transformer Era (2020–2022)**

Transformers had won in NLP (BERT), but they weren't yet seen as "General Purpose" agents. The focus shifted toward efficiency, fairness, and opening the "black box."

* Dominant theme: Self-Supervised Learning & Neuro-Symbolic AI. The paradigm shifted to "Pre-train then Fine-tune."
* Neuro-Symbolic AI: A very "AAAI" specific trend where researchers tried to combine Deep Learning magic with the old-school logic/reasoning strengths of Phase 1.
* Trustworthy AI: "Fairness," "Bias," and "Explainability" became massive tracks as models began being deployed in the real world.

Snapshot of 2021 Keywords: Self-Supervised Learning, Contrastive Learning, Fairness/Bias, Neuro-Symbolic AI, Few-Shot Learning.

{% include gallery.html gallery="aaai-26-singapore" %}
