import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TransferPlayer } from '@/data/transferData';
import { User, MapPin, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface PlayerDetailProps {
  player: TransferPlayer | null;
}

export const PlayerDetail: React.FC<PlayerDetailProps> = ({ player }) => {
  if (!player) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Select a player from the table to view their detailed profile.
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const statItems = [
    { label: 'Offensive Rating', value: player.offensiveRating, max: 130 },
    { label: 'Defensive Rating', value: player.defensiveRating, max: 120, inverted: true },
    { label: 'Usage Rate', value: player.usageRate, max: 35 },
    { label: 'eFG%', value: player.efgPercent, max: 70 },
    { label: '3P%', value: player.threePtPercent, max: 50 },
    { label: 'FT%', value: player.ftPercent, max: 100 },
    { label: 'Rebounding %', value: player.reboundingPercent, max: 25 },
    { label: 'Block %', value: player.blockPercent, max: 10 },
    { label: 'Steal %', value: player.stealPercent, max: 5 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Player Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">{player.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{player.position}</Badge>
              <Badge variant="outline">{player.height}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{player.previousTeam} ({player.conference})</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fit Score</span>
              <Badge className="text-lg px-3 py-1">
                {player.fitScore}/100
              </Badge>
            </div>
            <Progress value={player.fitScore} className="h-2" />
          </div>

          <div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {player.archetype}
            </Badge>
          </div>
        </div>

        {/* Season Averages */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Season Averages
          </h4>
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{player.ppg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">PPG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{player.rpg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">RPG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{player.apg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">APG</div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {player.minutes.toFixed(1)} minutes per game
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Advanced Metrics
          </h4>
          <div className="space-y-3">
            {statItems.map((stat) => {
              const percentage = stat.inverted 
                ? ((stat.max - stat.value) / stat.max) * 100
                : (stat.value / stat.max) * 100;
              
              return (
                <div key={stat.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{stat.label}</span>
                    <span className="font-medium">
                      {stat.value.toFixed(1)}{stat.label.includes('%') ? '%' : ''}
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.max(0, percentage))} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Summary */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Scouting Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {player.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};