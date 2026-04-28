# Script pour remplacer la page de garde de rapport_f.docx par p_gard.docx

$ErrorActionPreference = "Stop"

$rapportPath = Join-Path $PSScriptRoot "rapport_f.docx"
$pageGardePath = Join-Path $PSScriptRoot "p_gard.docx"
$backupPath = Join-Path $PSScriptRoot "rapport_f_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').docx"

Write-Host "`n🔄 Remplacement de la page de garde..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

# Vérifier que les fichiers existent
if (-not (Test-Path $rapportPath)) {
    Write-Host "✗ Fichier rapport_f.docx introuvable!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $pageGardePath)) {
    Write-Host "✗ Fichier p_gard.docx introuvable!" -ForegroundColor Red
    exit 1
}

# Créer une sauvegarde
Write-Host "1️⃣  Création de la sauvegarde..." -ForegroundColor Gray
Copy-Item $rapportPath $backupPath
Write-Host "   ✓ Sauvegarde: $(Split-Path $backupPath -Leaf)" -ForegroundColor Green

# Démarrer Word
Write-Host "`n2️⃣  Démarrage de Word..." -ForegroundColor Gray
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0 # wdAlertsNone

try {
    # Ouvrir les deux documents
    Write-Host "`n3️⃣  Ouverture des documents..." -ForegroundColor Gray
    $rapport = $word.Documents.Open($rapportPath)
    Write-Host "   ✓ rapport_f.docx ouvert" -ForegroundColor Green
    
    $pageGarde = $word.Documents.Open($pageGardePath)
    Write-Host "   ✓ p_gard.docx ouvert" -ForegroundColor Green
    
    # Copier tout le contenu de la page de garde
    Write-Host "`n4️⃣  Copie de la nouvelle page de garde..." -ForegroundColor Gray
    $pageGarde.Activate()
    $pageGarde.Content.Select()
    $word.Selection.Copy()
    Write-Host "   ✓ Contenu copié" -ForegroundColor Green
    
    # Aller dans le rapport et sélectionner la première page
    Write-Host "`n5️⃣  Suppression de l'ancienne page de garde..." -ForegroundColor Gray
    $rapport.Activate()
    
    # Aller au début du document
    $word.Selection.HomeKey(6) | Out-Null # wdStory = 6
    
    # Sélectionner jusqu'au premier saut de page/section
    $found = $false
    
    # Chercher un saut de page manuel (^m)
    $word.Selection.Find.ClearFormatting()
    $word.Selection.Find.Text = "^m"
    $word.Selection.Find.Forward = $true
    
    if ($word.Selection.Find.Execute()) {
        # Sélectionner du début jusqu'au saut de page inclus
        $word.Selection.HomeKey(6, 1) | Out-Null # wdExtend = 1
        $word.Selection.Delete() | Out-Null
        $found = $true
        Write-Host "   ✓ Saut de page manuel trouvé et supprimé" -ForegroundColor Green
    }
    
    if (-not $found) {
        # Chercher un saut de section (^b)
        $word.Selection.HomeKey(6) | Out-Null
        $word.Selection.Find.ClearFormatting()
        $word.Selection.Find.Text = "^b"
        $word.Selection.Find.Forward = $true
        
        if ($word.Selection.Find.Execute()) {
            $word.Selection.HomeKey(6, 1) | Out-Null
            $word.Selection.Delete() | Out-Null
            Write-Host "   ✓ Saut de section trouvé et supprimé" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ Aucun saut de page trouvé, suppression de la première page uniquement" -ForegroundColor Yellow
            # Sélectionner approximativement la première page (30 lignes)
            $word.Selection.HomeKey(6) | Out-Null
            $word.Selection.MoveDown(5, 1, 30) | Out-Null # wdLine = 5, wdExtend = 1
            $word.Selection.Delete() | Out-Null
        }
    }
    
    # Coller la nouvelle page de garde au début
    Write-Host "`n6️⃣  Insertion de la nouvelle page de garde..." -ForegroundColor Gray
    $word.Selection.HomeKey(6) | Out-Null
    $word.Selection.Paste()
    Write-Host "   ✓ Nouvelle page de garde insérée" -ForegroundColor Green
    
    # Sauvegarder le rapport
    Write-Host "`n7️⃣  Sauvegarde..." -ForegroundColor Gray
    $rapport.Save()
    Write-Host "   ✓ Document sauvegardé" -ForegroundColor Green
    
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "✅ Page de garde remplacée avec succès!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray
    
} catch {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "✗ Erreur: $_" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray
} finally {
    # Fermer les documents
    if ($pageGarde) { 
        $pageGarde.Close($false)
        Write-Host "   Fermeture de p_gard.docx" -ForegroundColor DarkGray
    }
    if ($rapport) { 
        $rapport.Close($false)
        Write-Host "   Fermeture de rapport_f.docx" -ForegroundColor DarkGray
    }
    
    # Quitter Word
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    Write-Host "   Word fermé`n" -ForegroundColor DarkGray
}

Write-Host "Vous pouvez maintenant ouvrir rapport_f.docx" -ForegroundColor Cyan
