# Script pour corriger "Révision:" → "Réalisé par:" dans la page de garde
# Créé le 18/04/2026

$sourceDocx = Join-Path $PSScriptRoot "p_gard.docx"
$outputPng = Join-Path $PSScriptRoot "p_gard_cover.png"
$rapportDocx = Join-Path $PSScriptRoot "Rapport de Stage -f-.docx"

Write-Host "=== Correction de la page de garde ===" -ForegroundColor Cyan
Write-Host "Fichier source: $sourceDocx" -ForegroundColor Yellow

if (-not (Test-Path $sourceDocx)) {
    Write-Host "ERREUR: Fichier source introuvable!" -ForegroundColor Red
    exit 1
}

try {
    # Créer l'objet Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture de $sourceDocx..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($sourceDocx)
    
    # Rechercher et remplacer "Révision:" par "Réalisé par:"
    Write-Host "Remplacement 'Revision:' en 'Realise par :'..." -ForegroundColor Yellow
    
    $findText = "Révision:"
    $replaceText = "Réalisé par :"
    
    $word.Selection.Find.ClearFormatting()
    $word.Selection.Find.Replacement.ClearFormatting()
    
    $word.Selection.Find.Text = $findText
    $word.Selection.Find.Replacement.Text = $replaceText
    $word.Selection.Find.Forward = $true
    $word.Selection.Find.Wrap = [Microsoft.Office.Interop.Word.WdFindWrap]::wdFindContinue
    $word.Selection.Find.Format = $false
    $word.Selection.Find.MatchCase = $false
    $word.Selection.Find.MatchWholeWord = $false
    
    $replaceCount = 0
    while ($word.Selection.Find.Execute()) {
        $word.Selection.Text = $replaceText
        $replaceCount++
    }
    
    if ($replaceCount -eq 0) {
        Write-Host "ATTENTION: Aucune occurrence de '$findText' trouvée!" -ForegroundColor Yellow
        Write-Host "Recherche de variantes..." -ForegroundColor Yellow
        
        # Essayer avec "Révision :" (avec espace avant les deux points)
        $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory)
        $word.Selection.Find.Text = "Révision :"
        if ($word.Selection.Find.Execute()) {
            $word.Selection.Text = $replaceText
            $replaceCount++
            Write-Host "Trouvé et remplacé 'Révision :' (avec espace)" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ $replaceCount occurrence(s) remplacée(s)" -ForegroundColor Green
    }
    
    # Sauvegarder le DOCX modifié
    Write-Host "Sauvegarde du fichier Word modifié..." -ForegroundColor Yellow
    $doc.Save()
    
    # Exporter en PNG haute résolution
    Write-Host "Export en PNG (haute résolution)..." -ForegroundColor Yellow
    
    # Utiliser la méthode ExportAsFixedFormat pour créer un PDF temporaire
    $tempPdf = Join-Path $PSScriptRoot "temp_page_garde.pdf"
    
    $doc.ExportAsFixedFormat(
        $tempPdf,
        [Microsoft.Office.Interop.Word.WdExportFormat]::wdExportFormatPDF,
        $false,
        [Microsoft.Office.Interop.Word.WdExportOptimizeFor]::wdExportOptimizeForPrint
    )
    
    Write-Host "Fermeture du document..." -ForegroundColor Yellow
    $doc.Close()
    $word.Quit()
    
    # Libérer les objets COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    # Convertir PDF → PNG avec ImageMagick ou autre outil
    # Si ImageMagick n'est pas disponible, demander à l'utilisateur de le faire manuellement
    
    if (Get-Command magick -ErrorAction SilentlyContinue) {
        Write-Host "Conversion PDF en PNG avec ImageMagick..." -ForegroundColor Yellow
        magick -density 300 $tempPdf -quality 100 $outputPng
        Remove-Item $tempPdf -Force
        Write-Host "✓ PNG créé: $outputPng" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "INFO: ImageMagick n'est pas installe." -ForegroundColor Yellow
        Write-Host "PDF temporaire cree: $tempPdf" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Pour terminer manuellement:" -ForegroundColor Cyan
        Write-Host "1. Ouvrez $tempPdf" -ForegroundColor White
        Write-Host "2. Exportez-le en PNG (Fichier > Exporter > Image > PNG)" -ForegroundColor White
        Write-Host "3. Enregistrez comme: $outputPng" -ForegroundColor White
        Write-Host "4. Executez a nouveau .\remplacer_page_garde_FULLSIZE.ps1" -ForegroundColor White
        exit 0
    }
    
    # Si on arrive ici, le PNG a été créé avec succès
    # Maintenant, remplacer dans le rapport principal
    Write-Host ""
    Write-Host "Mise à jour du rapport de stage..." -ForegroundColor Cyan
    
    # Relancer le script de remplacement de page de garde
    & (Join-Path $PSScriptRoot "remplacer_page_garde_FULLSIZE.ps1")
    
} catch {
    Write-Host ""
    Write-Host "ERREUR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    
    exit 1
}
