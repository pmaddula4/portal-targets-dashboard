import React from 'react';
import { Button } from '@/components/ui/button';
import { TransferPlayer } from '@/data/transferData';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  players: TransferPlayer[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ players }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (players.length === 0) {
      toast({
        title: "No data to export",
        description: "Please apply filters to see players before exporting.",
        variant: "destructive"
      });
      return;
    }

    // Define the CSV headers
    const headers = [
      'Name',
      'Position',
      'Height',
      'Previous Team',
      'Conference',
      'Fit Score',
      'Archetype',
      'PPG',
      'RPG',
      'APG',
      'Minutes',
      'Offensive Rating',
      'Defensive Rating',
      'Usage Rate',
      'eFG%',
      '3P%',
      'FT%',
      'Rebounding %',
      'Block %',
      'Steal %',
      'Summary'
    ];

    // Convert players data to CSV format
    const csvData = players.map(player => [
      player.name,
      player.position,
      player.height,
      player.previousTeam,
      player.conference,
      player.fitScore,
      player.archetype,
      player.ppg.toFixed(1),
      player.rpg.toFixed(1),
      player.apg.toFixed(1),
      player.minutes.toFixed(1),
      player.offensiveRating.toFixed(1),
      player.defensiveRating.toFixed(1),
      player.usageRate.toFixed(1),
      player.efgPercent.toFixed(1),
      player.threePtPercent.toFixed(1),
      player.ftPercent.toFixed(1),
      player.reboundingPercent.toFixed(1),
      player.blockPercent.toFixed(1),
      player.stealPercent.toFixed(1),
      `"${player.summary}"` // Wrap summary in quotes to handle commas
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transfer_portal_candidates_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export successful",
      description: `Exported ${players.length} players to CSV file.`,
    });
  };

  return (
    <Button onClick={exportToCSV} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};