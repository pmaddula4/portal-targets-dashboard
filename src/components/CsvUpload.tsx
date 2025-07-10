import { useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TransferPlayer } from '@/data/transferData';

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
          const players = results.data.map((row: any, index: number) => ({
            id: (index + 1).toString(),
            name: row.Name || row.name || `Player ${index + 1}`,
            position: row.Position || row.position || 'G',
            height: row.Height || row.height || '6\'0"',
            previousTeam: row['Previous Team'] || row.previousTeam || row['Previous_Team'] || 'Unknown',
            conference: row.Conference || row.conference || 'Unknown',
            offensiveRating: parseFloat(row['Offensive Rating'] || row.offensiveRating || row['Offensive_Rating'] || '100') || 100,
            defensiveRating: parseFloat(row['Defensive Rating'] || row.defensiveRating || row['Defensive_Rating'] || '100') || 100,
            usageRate: parseFloat(row['Usage Rate'] || row.usageRate || row['Usage_Rate'] || '20') || 20,
            efgPercent: parseFloat(row['eFG%'] || row.efgPercent || row['eFG_Percent'] || '50') || 50,
            threePtPercent: parseFloat(row['3PT%'] || row.threePtPercent || row['3PT_Percent'] || '35') || 35,
            ftPercent: parseFloat(row['FT%'] || row.ftPercent || row['FT_Percent'] || '75') || 75,
            reboundingPercent: parseFloat(row['Rebounding %'] || row.reboundingPercent || row['Rebounding_Percent'] || '10') || 10,
            blockPercent: parseFloat(row['Block %'] || row.blockPercent || row['Block_Percent'] || '2') || 2,
            stealPercent: parseFloat(row['Steal %'] || row.stealPercent || row['Steal_Percent'] || '2') || 2,
            ppg: parseFloat(row.PPG || row.ppg || row['Points Per Game'] || '12') || 12,
            rpg: parseFloat(row.RPG || row.rpg || row['Rebounds Per Game'] || '5') || 5,
            apg: parseFloat(row.APG || row.apg || row['Assists Per Game'] || '3') || 3,
            minutes: parseFloat(row.Minutes || row.minutes || row['Minutes Per Game'] || '25') || 25,
            fitScore: parseFloat(row['Fit Score'] || row.fitScore || row['Fit_Score'] || '50') || 50,
            archetype: row.Archetype || row.archetype || 'Balanced Player',
            summary: row.Summary || row.summary || 'No summary available'
          })) as TransferPlayer[];

          onDataLoaded(players);
          toast({
            title: "Data Loaded Successfully",
            description: `Imported ${players.length} players from CSV file.`,
          });

          // Reset file input
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
            Supported columns: Name, Position, Height, Previous Team, Conference, Stats, Fit Score, Archetype
          </div>
        </div>
      </CardContent>
    </Card>
  );
};