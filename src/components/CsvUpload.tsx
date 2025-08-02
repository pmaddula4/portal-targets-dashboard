import { useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { archetypes, TransferPlayer } from '@/data/transferData';
import teamSimilarityScores from '@/data/team_similarity_scores.json';
import playerFitScores from "@/data/player_similarity_scores.json";

interface CsvUploadProps {
  onDataLoaded: (data: TransferPlayer[]) => void;
}

export const CsvUpload = ({ onDataLoaded }: CsvUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const players = results.data
          .filter((row: any) => {
            const team = row.previousTeam;
            return !team.toLowerCase().includes('illinois');
          })
          .map((row: any, index: number) => {
            const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));
            const scale = (val: number, min: number, max: number) => (clamp(val, min, max) - min) / (max - min);

            const ppg = parseFloat(row.ppg);
            const ts = parseFloat(row.ts);
            const efg = parseFloat(row.efgPercent);
            const threePtPct = parseFloat(row.threePtPercent);
            const ftPct = parseFloat(row.ftPercent);
            const apg = parseFloat(row.apg);
            const astPct = parseFloat(row.ast_pct);
            const toPct = parseFloat(row.tov_pct);
            const stealPct = parseFloat(row.stealPercent);
            const blockPct = parseFloat(row.blockPercent);
            const drtg = parseFloat(row.defensiveRating);
            const rpg = parseFloat(row.rpg);
            const orebPct = parseFloat(row.oreb_pct);
            const drebPct = parseFloat(row.dreb_pct);
            const bpm = parseFloat(row.bpm);
            const obpm = parseFloat(row.obpm);
            const dbpm = parseFloat(row.dbpm);
            const ortg = parseFloat(row.offensiveRating);
            const usage = parseFloat(row.usageRate);
            const prpg = parseFloat(row.prpg)

            const PES = (
              0.10 * scale(ppg, 5, 20) +
              0.25 * ((scale(efg, 40, 55) + scale(threePtPct, 15, 37.5) + scale(ftPct, 55, 80) + scale(ts, 45, 60)) / 4) +
              0.15 * ((scale(apg, 1, 6) + scale(astPct, 5, 25) + (1 - scale(toPct, 10, 25))) / 3) +
              0.15 * ((scale(stealPct, 1, 2.5) + scale(blockPct, 0.5, 3) + (1 - scale(drtg, 100, 115))) / 3) +
              0.10 * ((scale(rpg, 1.5, 4) + scale(orebPct, 2, 10) + scale(drebPct, 7.5, 15)) / 3) +
              0.25 * ((scale(bpm, -5, 1.5) + scale(obpm, -4, 1.5) + scale(dbpm, -2, 1) + scale(prpg, 0, 2)) / 4)
            ) * 100;

            const inferPosition = (archetype: string): string => {
              if (archetype.toLowerCase().includes("pg")) return "PG";
              if (archetype.toLowerCase().includes("combo")) return "G";
              if (archetype.toLowerCase().includes("wing")) return "G/F";
              if (archetype.toLowerCase().includes("pf/c")) return "F/C";
              if (archetype.toLowerCase().includes("stretch")) return "PF";
              if (archetype.toLowerCase().includes("c")) return "C";
            };

            return {
              id: (index + 1).toString(),
              name: row.Name || row.name || `Player ${index + 1}`,
              height: row.Height || row.height || '6\'0"',
              previousTeam: row['Previous Team'] || row.previousTeam || row['Previous_Team'] || 'Unknown',
              conference: row.Conference || row.conference || 'Unknown',
              offensiveRating: ortg,
              defensiveRating: drtg,
              usageRate: usage,
              efgPercent: efg,
              threePtPercent: threePtPct,
              ftPercent: ftPct,
              offensiveReboundingPercent: orebPct,
              defensiveReboundingPercent: drebPct,
              blockPercent: blockPct,
              stealPercent: stealPct,
              ppg: ppg,
              rpg: rpg,
              apg: apg,
              minutes: parseFloat(row.Minutes || row.minutes || row['Minutes Per Game'] || '25') || 25,
              fitScore: (PES * 0.75) + (teamSimilarityScores[row.previousTeam] * 0.125) + (playerFitScores[row.name] * 0.125),
              archetype: row.Archetype || row.archetype || 'Balanced Player',
              position: inferPosition(row.archetype),
              summary: row.Summary || row.summary || 'No summary available',
              committed: row.Committed || row.committed || 'No'
            };
          }) as TransferPlayer[];

          onDataLoaded(players);
          toast({
            title: "Data Loaded Successfully",
            description: `Imported ${players.length} players from CSV file.`,
          });

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Error Parsing CSV",
            description: "There was an error processing your CSV file. Please check the format and try again.",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          title: "CSV Parse Error",
          description: "Failed to parse the CSV file. Please check the file format.",
          variant: "destructive",
        });
      }
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Transfer Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file with transfer portal player data. The file should include columns like Name, Position, Height, Previous Team, etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={triggerFileInput}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose CSV File
          </Button>
          <div className="text-sm text-muted-foreground">
            Supported columns: Name, Position, Height, Previous Team, Conference, Stats, Advanced Metrics, Archetype
          </div>
        </div>
      </CardContent>
    </Card>
  );
};