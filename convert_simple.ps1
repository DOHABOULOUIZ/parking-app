# Script simplifie de conversion HTML vers DOCX
# Rapport de Stage - Doha Boulouiz

Write-Host "Conversion HTML vers DOCX..." -ForegroundColor Yellow
Write-Host ""

$htmlFile = "RAPPORT_STAGE_FINAL.html"
$docxFile = "RAPPORT_STAGE_FINAL.docx"

if (-not (Test-Path $htmlFile)) {
    Write-Host "ERREUR: Fichier HTML introuvable!" -ForegroundColor Red
    exit 1
}

try {
    # Creer Word COM object
    $word = New-Object -ComObject Word.Application
    $word.Visible = $False
    
    # Ouvrir le HTML
    $fullPath = Resolve-Path $htmlFile
    $doc = $word.Documents.Open($fullPath.Path)
    
    # Preparer le chemin de sortie
    $savePath = Join-Path (Get-Location).Path $docxFile
    
    # Supprimer le fichier existant s'il existe
    if (Test-Path $savePath) {
        Remove-Item $savePath -Force
    }
    
    # Sauvegarder en DOCX
    $wdFormatDocumentDefault = 16
    $doc.SaveAs2($savePath, $wdFormatDocumentDefault)
    
    # Fermer
    $doc.Close($false)
    $word.Quit()
    
    # Cleanup
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "SUCCES! Fichier cree:" -ForegroundColor Green
    Write-Host $savePath -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Taille: $([math]::Round((Get-Item $savePath).Length / 1MB, 2)) MB" -ForegroundColor Yellow
    Write-Host ""
    
    # Ouvrir le fichier
    $open = Read-Host "Ouvrir le fichier maintenant? (O/N)"
    if ($open -eq 'O' -or $open -eq 'o') {
        Start-Process $savePath
    }
    
} catch {
    Write-Host ""
    Write-Host "ERREUR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions alternatives:" -ForegroundColor Yellow
    Write-Host "1. Ouvrez RAPPORT_STAGE_FINAL.html dans Word" -ForegroundColor White
    Write-Host "2. Fichier > Enregistrer sous > Format: Document Word (.docx)" -ForegroundColor White
    Write-Host ""
    
    # Cleanup en cas d'erreur
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
    
    exit 1
}
