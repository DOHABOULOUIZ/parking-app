# Script pour supprimer les pages blanches à la fin d'un document Word
# Utiliser le répertoire courant
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Chercher le fichier dans le répertoire courant
$docFile = Get-ChildItem -Path "." -Filter "Partenaires*.docx" | Select-Object -First 1
if ($null -eq $docFile) {
    Write-Host "Fichier non trouvé!"
    exit
}

$docPath = $docFile.FullName
Write-Host "Démarrage du script..."
Write-Host "Fichier trouvé: $($docFile.Name)"

# Créer une instance Word
$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
    Write-Host "Ouverture du document..."
    $doc = $word.Documents.Open($docPath)
    
    # Obtenir le nombre total de pages avant
    $pagesBefore = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    Write-Host "Nombre de pages avant: $pagesBefore"
    
    # Aller à la fin du document
    $word.Selection.EndKey(6) # 6 = wdStory (fin du document)
    
    # Supprimer les sauts de page manuels à la fin
    $word.Selection.Find.ClearFormatting()
    $word.Selection.Find.Replacement.ClearFormatting()
    $word.Selection.Find.Text = "^m"  # ^m = saut de page manuel
    $word.Selection.Find.Replacement.Text = ""
    $word.Selection.Find.Forward = $false
    $word.Selection.Find.Wrap = 0  # 0 = wdFindStop
    
    # Exécuter le remplacement plusieurs fois
    for ($i = 1; $i -le 5; $i++) {
        $word.Selection.Find.Execute($null, $null, $null, $null, $null, $null, $null, $null, $null, $null, 2) | Out-Null
    }
    
    # Supprimer les paragraphes vides à la fin (environ 2 pages de paragraphes vides)
    $word.Selection.EndKey(6) # Retourner à la fin
    
    $emptyLinesRemoved = 0
    $maxLines = 100  # Limite de sécurité
    
    while ($emptyLinesRemoved -lt $maxLines) {
        # Vérifier si on est sur une ligne vide
        $word.Selection.MoveUp(5, 1, 1)  # 5 = wdLine, sélectionner la ligne au-dessus
        
        if ($word.Selection.Text -match '^\s*$' -or $word.Selection.Text -eq "`r") {
            $word.Selection.Delete()
            $emptyLinesRemoved++
        } else {
            break
        }
    }
    
    Write-Host "Lignes vides supprimées: $emptyLinesRemoved"
    
    # Obtenir le nombre de pages après
    $pagesAfter = $doc.ComputeStatistics(2)
    Write-Host "Nombre de pages après: $pagesAfter"
    Write-Host "Pages supprimées: $($pagesBefore - $pagesAfter)"
    
    # Sauvegarder et fermer
    $doc.Save()
    $doc.Close()
    Write-Host "`nDocument sauvegardé avec succès!"
}
catch {
    Write-Host "`nErreur: $_"
    Write-Host $_.Exception.Message
}
finally {
    # Fermer Word
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
    Write-Host "Terminé."
}
