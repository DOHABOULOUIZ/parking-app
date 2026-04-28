# Script pour corriger la numérotation des pages du rapport HTML

$filePath = "RAPPORT_STAGE_2026_v1.html"

Write-Host "=== Correction de la numerotation des pages HTML ===" -ForegroundColor Cyan

# Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "RAPPORT_STAGE_2026_v1_backup_$timestamp.html"
Copy-Item $filePath $backupPath
Write-Host "Backup cree: $backupPath" -ForegroundColor Green

# Lire le contenu
$content = Get-Content $filePath -Raw

# Corrections des pages manquantes 9, 10, 11 (qui sont probablement mal numérotées)
# On suppose que PAGE 12 devrait être PAGE 9, etc. - mais regardons d'abord

# Corrections des duplications - renuméroter les doublons
Write-Host "Correction des duplications..." -ForegroundColor Yellow

# Les pages 16-24 ont des doublons qu'il faut renommer
$corrections = @{
    'PAGE 16 : DICTIONNAIRE DE DONNEES \(1\)' = 'PAGE 25 : DICTIONNAIRE DE DONNEES (1)'
    'PAGE 17 : DICTIONNAIRE DE DONNEES \(2\)' = 'PAGE 26 : DICTIONNAIRE DE DONNEES (2)'
    'PAGE 18 : MCD' = 'PAGE 27 : MCD'
    'PAGE 19 : MLD' = 'PAGE 28 : MLD'
    'PAGE 20 : ORGANIGRAMME' = 'PAGE 29 : ORGANIGRAMME'
    'PAGE 21 : CAS D.UTILISATION' = 'PAGE 30 : CAS D''UTILISATION'
    'PAGE 22 : DIAGRAMME DE CLASSES' = 'PAGE 31 : DIAGRAMME DE CLASSES'
    'PAGE 23 : UI' = 'PAGE 32 : UI'
    'PAGE 24 : UX' = 'PAGE 33 : UX'
    
    # Décaler les pages suivantes
    'PAGE 25 : CODAGE' = 'PAGE 34 : CODAGE'
    'PAGE 26 : PROMOTION' = 'PAGE 35 : PROMOTION'
    'PAGE 27 : ARCHITECTURE' = 'PAGE 36 : ARCHITECTURE'
    'PAGE 28 : DIFFICULTES' = 'PAGE 37 : DIFFICULTES'
    'PAGE 29 : CONCLUSION' = 'PAGE 38 : CONCLUSION'
    'PAGE 30 : BIBLIOGRAPHIE' = 'PAGE 39 : BIBLIOGRAPHIE'
    'PAGE 31 : TABLE DES FIGURES' = 'PAGE 40 : TABLE DES FIGURES'
    'PAGE 32 : INDEX' = 'PAGE 41 : INDEX'
    
    # Corriger les pages manquantes (12→9, 13→10, etc.) si LOCALISATION devrait être PAGE 9
    # 'PAGE 12 : LOCALISATION' = 'PAGE 9 : LOCALISATION'
    # 'PAGE 13 : MOYENS HUMAINS 1' = 'PAGE 10 : MOYENS HUMAINS 1'
    # 'PAGE 14 : MOYENS HUMAINS 2' = 'PAGE 11 : MOYENS HUMAINS 2'
    # 'PAGE 15 : DEPARTEMENT' = 'PAGE 12 : DEPARTEMENT'
    # 'PAGE 16 : POSTE' = 'PAGE 13 : POSTE'
    # 'PAGE 17 : PROJET' = 'PAGE 14 : PROJET'
}

foreach ($old in $corrections.Keys) {
    $new = $corrections[$old]
    $pattern = "<!-- ==================== $old ==================== -->"
    $replacement = "<!-- ==================== $new ==================== -->"
    
    if ($content -match [regex]::Escape($pattern)) {
        $content = $content -replace [regex]::Escape($pattern), $replacement
        Write-Host "  $old -> $new" -ForegroundColor Gray
    }
}

# Sauvegarder
$content | Set-Content $filePath -Encoding UTF8
Write-Host ""
Write-Host "=== TERMINE ===" -ForegroundColor Green
Write-Host "Les duplications ont ete corrigees" -ForegroundColor Green
Write-Host "Fichier sauvegarde: $filePath" -ForegroundColor Cyan
