# ========================================
# Script de Conversion HTML vers DOCX
# Rapport de Stage - Doha Boulouiz
# ========================================

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   Conversion Rapport HTML vers DOCX" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$htmlFile = "RAPPORT_STAGE_FINAL.html"
$docxFile = "RAPPORT_STAGE_FINAL.docx"

# Verifier si le fichier HTML existe
if (-not (Test-Path $htmlFile)) {
    Write-Host "ERREUR: Le fichier $htmlFile n existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "Fichier source: $htmlFile" -ForegroundColor Green
Write-Host "Fichier cible: $docxFile" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "Demarrage de Microsoft Word..." -ForegroundColor Yellow
    
    # Creer une instance de Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Word demarre avec succes" -ForegroundColor Green
    Write-Host "Ouverture du fichier HTML..." -ForegroundColor Yellow
    
    # Ouvrir le fichier HTML
    $fullPath = (Get-Item $htmlFile).FullName
    $doc = $word.Documents.Open($fullPath)
    
    Write-Host "Fichier HTML ouvert" -ForegroundColor Green
    Write-Host "Conversion en DOCX..." -ForegroundColor Yellow
    
    # Definir le chemin de sortie
    $outputPath = Join-Path (Get-Location) $docxFile
    
    # Sauvegarder en DOCX (format 16 = wdFormatXMLDocument)
    $doc.SaveAs([ref]$outputPath, [ref]16)
    
    Write-Host "Conversion reussie!" -ForegroundColor Green
    
    # Fermer le document
    $doc.Close()
    $word.Quit()
    
    # Liberer les objets COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "   CONVERSION TERMINEE AVEC SUCCES!" -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Fichier cree: $outputPath" -ForegroundColor Green
    Write-Host "Taille: $([math]::Round((Get-Item $outputPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Vous pouvez maintenant ouvrir le fichier avec Microsoft Word" -ForegroundColor Yellow
    Write-Host ""
    
    # Demander si on veut ouvrir le fichier
    $response = Read-Host "Voulez-vous ouvrir le fichier maintenant? (O/N)"
    if ($response -eq 'O' -or $response -eq 'o') {
        Start-Process $outputPath
    }
    
} catch {
    Write-Host ""
    Write-Host "ERREUR lors de la conversion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions possibles:" -ForegroundColor Yellow
    Write-Host "   1. Assurez-vous que Microsoft Word est installe" -ForegroundColor White
    Write-Host "   2. Fermez tous les documents Word ouverts" -ForegroundColor White
    Write-Host "   3. Executez PowerShell en tant qu administrateur" -ForegroundColor White
    Write-Host ""
    exit 1
}
