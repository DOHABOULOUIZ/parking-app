# Script pour vérifier le contenu des premières pages d'un document Word
param(
    [string]$docPath = "Rapport de Stage -f-f.docx"
)

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "=== Verification du contenu: $docPath ===" -ForegroundColor Cyan
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    Write-Host "`nNombre total de pages: $($doc.ComputeStatistics(2))" -ForegroundColor Yellow
    Write-Host "Nombre de sections: $($doc.Sections.Count)" -ForegroundColor Yellow
    
    # Extraire le texte des 5 premières pages
    for ($pageNum = 1; $pageNum -le 5; $pageNum++) {
        Write-Host "`n--- PAGE $pageNum ---" -ForegroundColor Green
        
        # Aller à la page
        $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                            [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                            $pageNum) | Out-Null
        
        # Sélectionner toute la page
        $word.Selection.Bookmarks.Item("\page").Select()
        
        # Obtenir le texte
        $pageText = $word.Selection.Text
        
        if ($pageText.Trim().Length -eq 0) {
            Write-Host "[PAGE VIDE]" -ForegroundColor Red
        } elseif ($pageText.Trim().Length -lt 50) {
            Write-Host "Contenu court: $($pageText.Trim())" -ForegroundColor Yellow
        } else {
            # Afficher les 100 premiers caractères
            $preview = $pageText.Trim().Substring(0, [Math]::Min(100, $pageText.Trim().Length))
            Write-Host "Contenu: $preview..." -ForegroundColor White
        }
    }
    
    $doc.Close([ref]$false)
    $word.Quit()
    
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
} catch {
    Write-Host "ERREUR: $_" -ForegroundColor Red
    if ($doc) { $doc.Close([ref]$false) }
    if ($word) { $word.Quit() }
}
