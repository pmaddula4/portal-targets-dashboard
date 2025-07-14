import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransferPlayer } from '@/data/transferData';
import { Users, TrendingUp, Award, Target } from 'lucide-react';

interface DashboardStatsProps {
  players: TransferPlayer[];
  totalPlayers: number;
}

const conferenceFullNames: Record<string, string> = {
  AE: "America East",
  ASun: "ASUN",
  Amer: "AAC",
  B10: "Big 10",
  B12: "Big 12",
  BE: "Big East",
  BSky: "Big Sky",
  BSouth: "Big South",
  BW: "Big West",
  Horz: "Horizon",
  MWC: "Mountain West",
  Pat: "Patriot",
  SB: "Sun Belt",
  SC: "SoCon",
  Slnd: "Southland",
  Sum: "Summit",
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({ players, totalPlayers }) => {
  const averageFitScore = players.length > 0 
    ? players.reduce((sum, player) => sum + player.fitScore, 0) / players.length 
    : 0;

  const highFitPlayers = players.filter(player => player.fitScore >= 75).length;
  
  const topPositions = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonPosition = Object.entries(topPositions)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const topConferences = players.reduce((acc, player) => {
    acc[player.conference] = (acc[player.conference] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonConference = Object.entries(topConferences)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const aiInsights = [
    `${highFitPlayers} players have fit scores above 75, indicating strong alignment with team needs.`,
    `Most candidates are ${mostCommonPosition}s, suggesting depth in this position within the portal.`,
    `${conferenceFullNames[mostCommonConference] || mostCommonConference} leads in candidate count, showing strong talent pipeline from this conference.`,
    players.length > 0 ? `Average fit score of ${averageFitScore.toFixed(1)} indicates ${averageFitScore >= 70 ? 'high-quality' : averageFitScore >= 55 ? 'average' : 'low-quality'} candidate pool.` : ''
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{players.length}</div>
          <p className="text-xs text-muted-foreground">
            of {totalPlayers} total players
          </p>
        </CardContent>
      </Card>

      {/* Average Fit Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Fit Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageFitScore.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            {averageFitScore >= 70 ? 'Good' : averageFitScore >= 55 ? 'Average' : 'Subpar'} match quality
          </p>
        </CardContent>
      </Card>

      {/* High-Fit Players */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Fit Players</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highFitPlayers}</div>
          <p className="text-xs text-muted-foreground">
            Fit score ≥ 75
          </p>
        </CardContent>
      </Card>

      {/* Top Position */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Available</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostCommonPosition}</div>
          <p className="text-xs text-muted-foreground">
            {topPositions[mostCommonPosition] || 0} players
          </p>
        </CardContent>
      </Card>

      {/* AI Insights Card - Full Width */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Recruiting Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">
                  {index + 1}
                </Badge>
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};