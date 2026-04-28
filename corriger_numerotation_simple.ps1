# Script de correction simple de la numérotation des pages
# Approche minimale : désactiver le redémarrage de numérotation dans section 2

Write-Host "=== Correction de la numerotation - Approche simple ===" -ForegroundColor Cyan

$docPath = "Rapport de Stage -f-.docx"

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document non trouve" -ForegroundColor Red
    exit 1
}

# Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "Rapport de Stage -f-_backup_simple_$timestamp.docx"
Copy-Item $docPath $backupPath
Write-Host "Backup cree: $backupPath" -ForegroundColor Green

try {
    # Demarrer Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    $sectionCount = $doc.Sections.Count
    Write-Host "Nombre de sections: $sectionCount" -ForegroundColor Cyan
    
    # Section 1 : Page de garde - pas de numéro
    Write-Host "Section 1 (page de garde): Suppression numerotation..." -ForegroundColor Yellow
    $section1 = $doc.Sections.Item(1)
    $footer1 = $section1.Footers.Item(1)  # wdHeaderFooterPrimary = 1
    
    # Ne pas lier au précédent (il n'y en a pas)
    $footer1.LinkToPrevious = $false
    
    # Supprimer tous les éléments de numérotation
    if ($footer1.Range.Text) {
        $footer1.Range.Delete() | Out-Null
    }
    
    # Section 2 : Ajouter la numérotation qui commence à 1
    if ($sectionCount -ge 2) {
        Write-Host "Section 2: Ajout de la numerotation..." -ForegroundColor Yellow
        $section2 = $doc.Sections.Item(2)
        $footer2 = $section2.Footers.Item(1)
        
        # NE PAS lier au précédent (section 1 n'a pas de numéro)
        $footer2.LinkToPrevious = $false
        
        # Supprimer contenu existant et ajouter numéro de page
        $footer2.Range.Delete() | Out-Null
        $footer2.PageNumbers.Add(1) | Out-Null  # wdAlignPageNumberCenter = 1
        
        Write-Host "Section 2: Numerotation ajoutee" -ForegroundColor Green
    }
    
    # Sections 3+ : Lier les pieds de page à la section 2 pour continuer la numérotation
    if ($sectionCount -ge 3) {
        for ($i = 3; $i -le $sectionCount; $i++) {
            if ($i % 10 -eq 0) {
                Write-Host "  Traitement section $i / $sectionCount..." -ForegroundColor DarkGray
            }
            $section = $doc.Sections.Item($i)
            $footer = $section.Footers.Item(1)
            
            # Lier au pied de page précédent
            $footer.LinkToPrevious = $true
        }
        Write-Host "Sections 3-$sectionCount : Pieds de page lies (numerotation continue)" -ForegroundColor Green
    }
    
    # Sauvegarder
    Write-Host "Sauvegarde du document..." -ForegroundColor Yellow
    $doc.Save()
    
    Write-Host ""
    Write-Host "=== SUCCES ===" -ForegroundColor Green
    Write-Host "La numerotation devrait maintenant etre correcte:" -ForegroundColor Green
    Write-Host "  - Page de garde: pas de numero" -ForegroundColor White
    Write-Host "  - Pages suivantes: 1, 2, 3, 4, 5..." -ForegroundColor White
    
} catch {
    Write-Host "ERREUR: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    if ($doc) {
        $doc.Close([ref]$false)
    }
    if ($word) {
        $word.Quit()
    }
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

Write-Host ""
Write-Host "Vous pouvez maintenant ouvrir le document pour verifier." -ForegroundColor Cyan
