import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransferPlayer, positions, conferences, archetypes } from '@/data/transferData';
import { PlayerTable } from './PlayerTable';
import { PlayerDetail } from './PlayerDetail';
import { DashboardStats } from './DashboardStats';
import { ExportButton } from './ExportButton';
import { CsvUpload } from './CsvUpload';
import { Search, Filter, TrendingUp } from 'lucide-react';

interface Filters {
  position: string;
  conference: string;
  archetype: string;
  heightRange: [number, number];
  usageRange: [number, number];
  fitScoreThreshold: number;
  searchTerm: string;
}

export const TransferDashboard: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<TransferPlayer | null>(null);
  const [players, setPlayers] = useState<TransferPlayer[]>([]);
  const [filters, setFilters] = useState<Filters>({
    position: 'All',
    conference: 'All',
    archetype: 'All',
    heightRange: [66, 84], // 5'6" to 7'0" in inches
    usageRange: [0, 35],
    fitScoreThreshold: 0,
    searchTerm: ''
  });

  const convertHeightToInches = (height: string): number => {
    const match = height.match(/(\d+)'(\d+)"/);
    if (match) {
      return parseInt(match[1]) * 12 + parseInt(match[2]);
    }
    return 72; // default 6'0"
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const playerHeight = convertHeightToInches(player.height);
      
      return (
        (filters.position === 'All' || player.position === filters.position) &&
        (filters.conference === 'All' || player.conference === filters.conference) &&
        (filters.archetype === 'All' || player.archetype === filters.archetype) &&
        playerHeight >= filters.heightRange[0] &&
        playerHeight <= filters.heightRange[1] &&
        player.usageRate >= filters.usageRange[0] &&
        player.usageRate <= filters.usageRange[1] &&
        player.fitScore >= filters.fitScoreThreshold &&
        (filters.searchTerm === '' || 
         player.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         player.previousTeam.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    });
  }, [players, filters]);

  const handleDataLoaded = (newPlayers: TransferPlayer[]) => {
    setPlayers(newPlayers);
    setSelectedPlayer(null);
  };

  const clearFilters = () => {
    setFilters({
      position: 'All',
      conference: 'All',
      archetype: 'All',
      heightRange: [66, 84],
      usageRange: [0, 35],
      fitScoreThreshold: 0,
      searchTerm: ''
    });
  };

  const formatHeight = (inches: number): string => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Transfer Portal Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Identify and prioritize basketball transfer targets based on statistical fit and team needs
          </p>
        </div>

        {/* CSV Upload */}
        <CsvUpload onDataLoaded={handleDataLoaded} />

        {/* Dashboard Stats */}
        <DashboardStats players={filteredPlayers} totalPlayers={players.length} />

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Players</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or previous team..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={filters.position} onValueChange={(value) => setFilters({ ...filters, position: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conference</Label>
                <Select value={filters.conference} onValueChange={(value) => setFilters({ ...filters, conference: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conferences.map(conf => (
                      <SelectItem key={conf} value={conf}>{conf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Archetype</Label>
                <Select value={filters.archetype} onValueChange={(value) => setFilters({ ...filters, archetype: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {archetypes.map(arch => (
                      <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Height Range: {formatHeight(filters.heightRange[0])} - {formatHeight(filters.heightRange[1])}</Label>
                <Slider
                  value={filters.heightRange}
                  onValueChange={(value) => setFilters({ ...filters, heightRange: value as [number, number] })}
                  min={66}
                  max={84}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Usage Rate: {filters.usageRange[0]}% - {filters.usageRange[1]}%</Label>
                <Slider
                  value={filters.usageRange}
                  onValueChange={(value) => setFilters({ ...filters, usageRange: value as [number, number] })}
                  min={0}
                  max={35}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Fit Score Threshold */}
            <div className="space-y-2">
              <Label>Minimum Fit Score: {filters.fitScoreThreshold}</Label>
              <Slider
                value={[filters.fitScoreThreshold]}
                onValueChange={(value) => setFilters({ ...filters, fitScoreThreshold: value[0] })}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredPlayers.length} of {players.length} players shown
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <ExportButton players={filteredPlayers} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Table */}
          <div className="lg:col-span-2">
            <PlayerTable 
              players={filteredPlayers} 
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>

          {/* Player Detail */}
          <div className="lg:col-span-1">
            <PlayerDetail player={selectedPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
};