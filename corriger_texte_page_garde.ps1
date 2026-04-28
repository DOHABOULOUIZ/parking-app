# Script simple pour corriger "Révision:" en "Réalisé par :" dans p_gard.docx
# Créé le 18/04/2026

$docPath = Join-Path $PSScriptRoot "p_gard.docx"

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: $docPath introuvable!" -ForegroundColor Red
    exit 1
}

Write-Host "=== Correction de la page de garde ===" -ForegroundColor Cyan

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $true  # Visible pour que vous puissiez voir les modifications
    
    Write-Host "Ouverture de p_gard.docx..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($docPath)
    
    Write-Host "Recherche et remplacement..." -ForegroundColor Yellow
    
    # Rechercher "Révision:" ou "Révision :"
    $find = $word.Selection.Find
    $find.ClearFormatting()
    $find.Replacement.ClearFormatting()
    
    $find.Text = "Révision*:"  # * = caractère joker pour espace optionnel
    $find.Replacement.Text = "Réalisé par :"
    $find.Forward = $true
    $find.Wrap = 1  # wdFindContinue
    $find.Format = $false
    $find.MatchCase = $false
    $find.MatchWildcards = $true
    
    $replacedCount = $find.Execute([ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]$null, [ref]"Réalisé par :", [ref]2)  # 2 = wdReplaceAll
    
    if ($replacedCount) {
        Write-Host "Remplacement effectue!" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION: 'Revision:' non trouve. Verifiez manuellement." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "=== Word est maintenant ouvert ===" -ForegroundColor Cyan
    Write-Host "1. Verifiez que le texte 'Realise par :' est correct" -ForegroundColor White
    Write-Host "2. Sauvegardez (Ctrl+S)" -ForegroundColor White
    Write-Host "3. Exportez en PNG:" -ForegroundColor White
    Write-Host "   - Fichier > Enregistrer sous" -ForegroundColor Gray
    Write-Host "   - Type: PNG (*.png)" -ForegroundColor Gray
    Write-Host "   - Nom: p_gard_cover.png" -ForegroundColor Gray
    Write-Host "4. Fermez Word" -ForegroundColor White
    Write-Host "5. Relancez: .\remplacer_page_garde_FULLSIZE.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Le script attend que vous fermiez Word..." -ForegroundColor Cyan
    
    # Le script se termine ici, laissant Word ouvert pour que l'utilisateur puisse travailler
    
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    exit 1
}
