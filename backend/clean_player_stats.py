import pandas as pd

df = pd.read_csv("data/transfer_portal_all_stats_2025_full.csv")

df.rename(columns={
    "unknown1": "defensiveRating",
    "ortg": "offensiveRating",
    "team": "previousTeam",
    "usg": "usageRate",
    "efg": "efgPercent",
    "blk_pct": "blockPercent",
    "stl_pct": "stealPercent",
    "pts": "ppg",
    "ast": "apg",
    "reb": "rpg",
    "role": "archetype",
    "d-prpg": "def_prpg",
    "to_pct": "tov_pct",
    }, inplace=True)

del df["del"]
del df["unknown"]
del df["dunknums"]
del df["closenums"]
del df["farnums"]
del df["ftnums"]
del df["2ptnums"]
del df["3ptnums"]

df['minutes'] = df['min_pct'] * 0.4
df['minutes'] = df['minutes'].round(2)
df['name'] = df['name'].str.replace(r'\*$', '', regex=True)
df['height'] = df['height'].str.replace('-', "'", regex=False)
df['height'] = df['height'] + '"'
df['threePtPercent'] = df['3pt_pct'] * 100
df['threePtPercent'] = df['threePtPercent'].round(1)
df['ftPercent'] = df['ft_pct'] * 100
df['ftPercent'] = df['ftPercent'].round(1)

df.to_csv("data/cleaned_player_stats_full.csv", index=False)
print("cleaned player stats saved as 'cleaned_player_stats_full.csv'")