import pandas as pd

df = pd.read_csv("barttorvik_team_tables_each.csv")

df.rename(columns={
    "Unnamed: 0": "Rank",
    "Adj OE": "adj_off_eff",
    "Adj DE": "adj_def_eff",
    "eFG D.": "def_eFG",
    "FT Rate": "ft_rate",
    "FT Rate D": "def_ft_rate",
    "TOV%": "tov_pct",
    "TOV% D": "def_tov_pct",
    "O Reb%": "oreb_pct",
    "Op OReb%": "opp_oreb_pct",
    "2P %": "2pt_pct",
    "2P % D.": "def_2pt_pct",
    "3P %": "3pt_pct",
    "3P % D.": "def_3pt_pct",
    "Blk %": "blk_pct",
    "Blked %": "def_blk_pct",
    "Ast %": "ast_pct",
    "Op Ast %": "opp_ast_pct",
    "3P Rate": "3pt_rate",
    "3P Rate D": "def_3pt_rate",
    "Adj. T": "adj_temp",
    "Avg Hgt.": "avg_hgt",
    "Eff. Hgt.": "eff_hgt",
    "Exp.": "exp",
    "FT%": "ft_pct",
    "Op. FT%": "opp_ft_pct",
    "PPP Off.": "off_ppp",
    "PPP Def.": "def_ppp"
    }, inplace=True)
del df["Unnamed: 35"]
del df["Team.1"]
del df["Record"]
del df["Year"]

df["Losses"] = df["Games"] - df["Wins"]

df.to_csv("cleaned_team_tables.csv", index=False)
print("cleaned table saved as 'cleaned_team_tables.csv'")