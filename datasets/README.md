# Datasets

This project uses two benchmark corpora.

## 1. LIAR (included)

The LIAR benchmark (Wang 2017) is included in full under `liar_dataset/`.

| Property | Value |
| --- | --- |
| Records | 12,836 short political statements |
| Splits | train.tsv (10,269) / valid.tsv (1,284) / test.tsv (1,283) |
| Labels | 6-class: pants-fire, false, barely-true, half-true, mostly-true, true |
| Source | https://www.cs.ucsb.edu/~william/data/liar_dataset.zip |

Each row has 14 tab-separated fields: id, label, statement, subject, speaker,
job_title, state, party, and five credit-history counts, plus context.

## 2. WELFake (download separately — 234 MB)

WELFake (Verma, Agrawal, and Patel 2021) is too large to bundle here.
Download `WELFake_Dataset.csv` and place it in this folder:

- Source: https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification

| Property | Value |
| --- | --- |
| Records | 72,134 news articles (≈ balanced real/fake) |
| Columns | title, text, label (0 = real, 1 = fake) |

The notebook trains the WELFake classifier on a stratified subsample for speed.
