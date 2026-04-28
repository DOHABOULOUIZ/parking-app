<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get comprehensive dashboard with all statistics
     */
    public function dashboard(Request $request)
    {
        $period = $request->input('period', 'week');
        
        return response()->json(
            $this->analyticsService->getCompleteDashboardStats($period)
        );
    }

    /**
     * Get occupancy trend
     */
    public function occupancyTrend(Request $request)
    {
        $days = $request->input('days', 7);
        
        return response()->json([
            'trend' => $this->analyticsService->getOccupancyTrend($days),
        ]);
    }

    /**
     * Get revenue trend
     */
    public function revenueTrend(Request $request)
    {
        $days = $request->input('days', 30);
        
        return response()->json([
            'trend' => $this->analyticsService->getRevenueTrend($days),
        ]);
    }

    /**
     * Get cancellation trend
     */
    public function cancellationTrend(Request $request)
    {
        $days = $request->input('days', 7);
        
        return response()->json([
            'trend' => $this->analyticsService->getCancellationTrend($days),
        ]);
    }

    /**
     * Get sector comparison
     */
    public function sectorComparison()
    {
        return response()->json([
            'comparison' => $this->analyticsService->compareSectors(),
        ]);
    }

    /**
     * Get hourly occupancy (heat map data)
     */
    public function hourlyOccupancy(Request $request)
    {
        $period = $request->input('period', 'week');
        
        return response()->json([
            'hourly' => $this->analyticsService->getHourlyOccupancyRate($period),
        ]);
    }

    /**
     * Get top users
     */
    public function topUsers(Request $request)
    {
        $limit = $request->input('limit', 5);
        $period = $request->input('period', 'month');
        
        return response()->json([
            'top_users' => $this->analyticsService->getTopUsers($limit, $period),
        ]);
    }

    /**
     * Get revenue per place
     */
    public function revenuePerPlace(Request $request)
    {
        $period = $request->input('period', 'month');
        
        return response()->json([
            'revenue_per_place' => $this->analyticsService->getRevenuePerPlace($period),
        ]);
    }

    /**
     * Get duration distribution
     */
    public function durationDistribution(Request $request)
    {
        $period = $request->input('period', 'month');
        
        return response()->json([
            'distribution' => $this->analyticsService->getDurationDistribution($period),
        ]);
    }

    /**
     * Export comprehensive report
     */
    public function exportReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'format'     => 'in:json,csv,excel',
        ]);

        $report   = $this->analyticsService->generateReport($request->start_date, $request->end_date);
        $format   = $request->input('format', 'json');
        $filename = 'rapport_analytics_' . $report['period']['start'] . '_' . $report['period']['end'];

        if ($format === 'json') {
            return response()->json($report);
        }

        // ── CSV export ────────────────────────────────────────────
        if ($format === 'csv') {
            $rows   = [];
            $rows[] = ['Rapport Analytics'];
            $rows[] = ['Période', $report['period']['start'] . ' → ' . $report['period']['end']];
            $rows[] = [];
            $rows[] = ['=== Résumé ==='];
            $rows[] = ['Taux d\'occupation (%)', $report['summary']['occupancy_rate']];
            $rows[] = ['Revenus totaux (MAD)',   $report['summary']['total_revenue']];
            $rows[] = ['Total réservations',     $report['summary']['total_reservations']];
            $rows[] = ['Durée moyenne (h)',       $report['summary']['avg_duration']];
            $rows[] = [];
            $rows[] = ['=== Secteurs ==='];
            $rows[] = ['Secteur', 'Places', 'Réservations', 'Revenus (MAD)'];
            foreach ($report['sectors'] as $s) {
                $rows[] = [
                    data_get($s, 'name', 'N/A'),
                    data_get($s, 'total_places', 0),
                    data_get($s, 'total_reservations', 0),
                    data_get($s, 'total_revenue', 0),
                ];
            }
            $rows[] = [];
            $rows[] = ['=== Utilisateurs ==='];
            $rows[] = ['Total', 'Actifs', 'Nouveaux'];
            $rows[] = [
                $report['users']['total_users']  ?? 0,
                $report['users']['active_users'] ?? 0,
                $report['users']['new_users']    ?? 0,
            ];

            $tmp = fopen('php://temp', 'r+');
            foreach ($rows as $row) {
                fputcsv($tmp, $row, ';');
            }
            rewind($tmp);
            $csv = stream_get_contents($tmp);
            fclose($tmp);

            return response($csv, 200, [
                'Content-Type'        => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
                'Cache-Control'       => 'no-store',
            ]);
        }

        // ── Excel (.xlsx) export ──────────────────────────────────
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rapport Analytics');

        // Header style
        $headerStyle = [
            'font'      => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2563EB']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ];
        $sectionStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => '1E40AF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EFF6FF']],
        ];

        $row = 1;

        // Title
        $sheet->setCellValue('A' . $row, 'Rapport Analytics');
        $sheet->getStyle('A' . $row)->applyFromArray(['font' => ['bold' => true, 'size' => 16]]);
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $row++;

        $sheet->setCellValue('A' . $row, 'Période : ' . $report['period']['start'] . ' → ' . $report['period']['end']);
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $row += 2;

        // Summary section
        $sheet->setCellValue('A' . $row, 'RÉSUMÉ');
        $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray($sectionStyle);
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $row++;

        $summaryData = [
            ['Taux d\'occupation (%)', $report['summary']['occupancy_rate']],
            ['Revenus totaux (MAD)',   $report['summary']['total_revenue']],
            ['Total réservations',     $report['summary']['total_reservations']],
            ['Durée moyenne (h)',       $report['summary']['avg_duration']],
        ];
        foreach ($summaryData as [$label, $value]) {
            $sheet->setCellValue('A' . $row, $label);
            $sheet->setCellValue('B' . $row, $value);
            $row++;
        }
        $row++;

        // Sectors section
        $sheet->setCellValue('A' . $row, 'SECTEURS');
        $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray($sectionStyle);
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $row++;

        foreach (['A', 'B', 'C', 'D'] as $col) {
            $sheet->getStyle($col . $row)->applyFromArray($headerStyle);
        }
        $sheet->setCellValue('A' . $row, 'Secteur');
        $sheet->setCellValue('B' . $row, 'Places');
        $sheet->setCellValue('C' . $row, 'Réservations');
        $sheet->setCellValue('D' . $row, 'Revenus (MAD)');
        $row++;

        foreach ($report['sectors'] as $s) {
            $sheet->setCellValue('A' . $row, data_get($s, 'name', 'N/A'));
            $sheet->setCellValue('B' . $row, data_get($s, 'total_places', 0));
            $sheet->setCellValue('C' . $row, data_get($s, 'total_reservations', 0));
            $sheet->setCellValue('D' . $row, data_get($s, 'total_revenue', 0));
            $row++;
        }
        $row++;

        // Users section
        $sheet->setCellValue('A' . $row, 'UTILISATEURS');
        $sheet->getStyle('A' . $row . ':C' . $row)->applyFromArray($sectionStyle);
        $sheet->mergeCells('A' . $row . ':C' . $row);
        $row++;

        foreach (['A', 'B', 'C'] as $col) {
            $sheet->getStyle($col . $row)->applyFromArray($headerStyle);
        }
        $sheet->setCellValue('A' . $row, 'Total');
        $sheet->setCellValue('B' . $row, 'Actifs');
        $sheet->setCellValue('C' . $row, 'Nouveaux');
        $row++;
        $sheet->setCellValue('A' . $row, $report['users']['total_users']  ?? 0);
        $sheet->setCellValue('B' . $row, $report['users']['active_users'] ?? 0);
        $sheet->setCellValue('C' . $row, $report['users']['new_users']    ?? 0);

        // Auto-size columns
        foreach (['A', 'B', 'C', 'D'] as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $tmp    = tempnam(sys_get_temp_dir(), 'analytics_');
        $writer->save($tmp);
        $content = file_get_contents($tmp);
        unlink($tmp);

        return response($content, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.xlsx"',
            'Cache-Control'       => 'no-store',
        ]);
    }
}
