import pandas as pd
import json
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("cleaned_team_tables.csv")

df.columns = df.columns.str.strip()

off_style_cols = [
    "adj_temp",
    "ft_rate",
    "tov_pct",
    "oreb_pct",
    "ast_pct",
    "3pt_rate"
]

def_style_cols = [
    "def_ft_rate",
    "def_tov_pct",
    "opp_oreb_pct",
    "blk_pct",
    "opp_ast_pct",
    "def_3pt_rate",
    "PAKE",
    "PASE"
]

scaler = StandardScaler()
off_style_matrix = scaler.fit_transform(df[off_style_cols])
def_style_matrix = scaler.fit_transform(df[def_style_cols])

off_similarity_matrix = cosine_similarity(off_style_matrix)
def_similarity_matrix = cosine_similarity(def_style_matrix)

illinois_index = df[df["Team"].str.lower().str.contains("illinois")].index[0]

off_illinois_similarities = off_similarity_matrix[illinois_index]
def_illinois_similarities = def_similarity_matrix[illinois_index]

off_results = pd.DataFrame({
    "Team": df["Team"],
    "Offensive Similarity": off_illinois_similarities
})
def_results = pd.DataFrame({
    "Team": df["Team"],
    "Defensive Similarity": def_illinois_similarities
})

off_results = off_results[~(off_results["Team"].str.lower().str.contains("illinois"))]
def_results = def_results[~(def_results["Team"].str.lower().str.contains("illinois"))]

off_results = off_results.sort_values("Offensive Similarity", ascending=False)
def_results = def_results.sort_values("Defensive Similarity", ascending=False)

combined = pd.merge(off_results, def_results, on="Team")
combined["Overall Similarity"] = (combined["Offensive Similarity"] + combined["Defensive Similarity"]) / 2
combined = combined.sort_values("Overall Similarity", ascending=False)

combined.to_csv("team_similarity_scores.csv", index=False)

newdf = pd.read_csv("team_similarity_scores.csv")

newdf['Offensive Similarity'] = (newdf['Offensive Similarity'] * 50) + 50
newdf['Defensive Similarity'] = (newdf['Defensive Similarity'] * 50) + 50
newdf['Overall Similarity'] = (newdf['Overall Similarity'] * 50) + 50
newdf.to_csv("team_similarity_scores.csv", index=False)

similarity_json = dict(zip(newdf["Team"], newdf["Overall Similarity"]))

with open("team_similarity_scores.json", "w") as f:
    json.dump(similarity_json, f, indent=2)
