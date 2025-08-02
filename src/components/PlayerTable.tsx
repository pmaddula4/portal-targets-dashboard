import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransferPlayer } from '@/data/transferData';
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerTableProps {
  players: TransferPlayer[];
  selectedPlayer: TransferPlayer | null;
  onSelectPlayer: (player: TransferPlayer) => void;
}

type SortField = keyof TransferPlayer;
type SortDirection = 'asc' | 'desc';

export const PlayerTable: React.FC<PlayerTableProps> = ({ players, selectedPlayer, onSelectPlayer }) => {
  const [sortField, setSortField] = useState<SortField>('fitScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const getStatBadge = (value: number, field: string, isPercentage: boolean = false) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let icon = <Minus className="h-3 w-3" />;
    
    const thresholds: { [key: string]: { high: number; low: number } } = {
      fitScore: { high: 75, low: 65 },
      offensiveRating: { high: 115, low: 105 },
      defensiveRating: { high: 105, low: 95 },
      efgPercent: { high: 55, low: 45 },
      threePtPercent: { high: 35, low: 30 },
      ftPercent: { high: 80, low: 70 },
      blockPercent: { high: 4, low: 2 },
      stealPercent: { high: 3, low: 2 },
      reboundingPercent: { high: 15, low: 10 }
    };

    const threshold = thresholds[field];
    if (threshold) {
      if (field === 'defensiveRating') {
        if (value <= threshold.high) {
          variant = "default";
          icon = <TrendingUp className="h-3 w-3" />;
        } else if (value <= threshold.low) {
          variant = "secondary";
        } else {
          variant = "destructive";
          icon = <TrendingDown className="h-3 w-3" />;
        }
      } else {
        if (value >= threshold.high) {
          variant = "default";
          icon = <TrendingUp className="h-3 w-3" />;
        } else if (value >= threshold.low) {
          variant = "secondary";
        } else {
          variant = "destructive";
          icon = <TrendingDown className="h-3 w-3" />;
        }
      }
    }

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {isPercentage ? `${value.toFixed(1)}%` : value.toFixed(1)}
      </Badge>
    );
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Portal Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="name">Player</SortableHeader>
                <SortableHeader field="position">Pos</SortableHeader>
                <SortableHeader field="height">Height</SortableHeader>
                <SortableHeader field="previousTeam">Previous Team</SortableHeader>
                <SortableHeader field="committed">Committed</SortableHeader>
                <SortableHeader field="fitScore">Fit Score</SortableHeader>
                <SortableHeader field="ppg">PPG</SortableHeader>
                <SortableHeader field="rpg">RPG</SortableHeader>
                <SortableHeader field="apg">APG</SortableHeader>
                <SortableHeader field="offensiveRating">Off. Rating</SortableHeader>
                <SortableHeader field="defensiveRating">Def. Rating</SortableHeader>
                <SortableHeader field="efgPercent">eFG%</SortableHeader>
                <SortableHeader field="threePtPercent">3P%</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow
                  key={player.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPlayer?.id === player.id 
                      ? 'bg-muted' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectPlayer(player)}
                >
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.position}</Badge>
                  </TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{player.previousTeam}</div>
                      <div className="text-sm text-muted-foreground">{player.conference}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={player.committed === 'Yes' ? 'default' : 'secondary'}>
                      {player.committed}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatBadge(player.fitScore, 'fitScore')}
                  </TableCell>
                  <TableCell>{player.ppg.toFixed(1)}</TableCell>
                  <TableCell>{player.rpg.toFixed(1)}</TableCell>
                  <TableCell>{player.apg.toFixed(1)}</TableCell>
                  <TableCell>
                    {getStatBadge(player.offensiveRating, 'offensiveRating')}
                  </TableCell>
                  <TableCell>
                    {getStatBadge(player.defensiveRating, 'defensiveRating')}
                  </TableCell>
                  <TableCell>
                    {getStatBadge(player.efgPercent, 'efgPercent', true)}
                  </TableCell>
                  <TableCell>
                    {getStatBadge(player.threePtPercent, 'threePtPercent', true)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {players.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No players match the current filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};