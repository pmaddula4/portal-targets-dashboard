import pandas as pd
import numpy as np
import json
import os
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

PLAYER_FILE = "data/cleaned_player_stats_full.csv"
TEAM_FILE = "data/cleaned_team_tables.csv"
OUTPUT_JSON = "data/output/player_similarity_scores.json"
ILLINOIS_TEAM_NAME = "illinois"

os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

teams = pd.read_csv(TEAM_FILE)
teams.columns = teams.columns.str.strip()

players = pd.read_csv(PLAYER_FILE)
players.columns = players.columns.str.strip()
players.fillna(np.nan, inplace=True)

off_cols = ["adj_temp", "ft_rate", "tov_pct", "oreb_pct", "ast_pct", "3pt_rate"]
valid_off = [col for col in off_cols if col in players.columns and col in teams.columns]

scaler_off = StandardScaler().fit(teams[valid_off])
illinois_index = teams[teams["Team"].str.lower().str.contains(ILLINOIS_TEAM_NAME)].index[0]
illinois_off = scaler_off.transform([teams.loc[illinois_index, valid_off]])[0]

player_to_team_map = {
    "stealPercent": "def_tov_pct",
    "blockPercent": "blk_pct",
    "dreb_pct": "opp_oreb_pct",
    "defensiveRating": "adj_def_eff"
}
player_cols = list(player_to_team_map.keys())
team_cols = list(player_to_team_map.values())

scaler_def = StandardScaler().fit(teams[team_cols])
illinois_def = scaler_def.transform([teams.loc[illinois_index, team_cols]])[0]

fit_scores = {}

for _, player in players.iterrows():
    name = player.get("name", "Unknown")
    score_components = []

    if all(pd.notna(player.get(col)) for col in valid_off):
        player_off_vec = scaler_off.transform(pd.DataFrame([player[valid_off]], columns=valid_off))[0]
        off_sim = cosine_similarity([player_off_vec], [illinois_off])[0][0]
    else:
        off_sim = None

    try:
        translated_dict = {
            "def_tov_pct": player["stealPercent"],
            "blk_pct": player["blockPercent"],
            "opp_oreb_pct": 0.5 * player["dreb_pct"],
            "adj_def_eff": player["defensiveRating"]
        }
        if all(pd.notna(val) for val in translated_dict.values()):
            translated_df = pd.DataFrame([translated_dict], columns=team_cols)
            scaled_def_vec = scaler_def.transform(translated_df)[0]
            def_sim = cosine_similarity([scaled_def_vec], [illinois_def])[0][0]
        else:
            def_sim = None
    except:
        def_sim = None

    sims = [s for s in [off_sim, def_sim] if s is not None]
    if sims:
        score = round((sum(sims) / len(sims)), 4)
        scaled_score = (score + 0.05) * 100 / 0.65
        fit_scores[name] = round(scaled_score, 4)

with open(OUTPUT_JSON, "w") as f:
    json.dump(fit_scores, f, indent=2)

print(f"Combined fit scores written to {OUTPUT_JSON}")
