<?php

namespace App\Console\Commands;

use App\Models\Place;
use App\Models\Sector;
use Illuminate\Console\Command;

class TestCreatePlace extends Command
{
    protected $signature = 'test:create-place';
    protected $description = 'Tester la création d\'une place directement';

    public function handle()
    {
        try {
            // Récupérer un secteur
            $sector = Sector::first();
            
            if (!$sector) {
                $this->error('❌ Aucun secteur trouvé!');
                return 1;
            }
            
            $this->info("✅ Secteur trouvé: {$sector->name} (ID: {$sector->id})");
            
            // Chercher une place avec un numéro unique
            $number = 'TEST-' . time();
            
            // Vérifier si elle existe déjà
            $exists = Place::where('place_number', $number)->first();
            if ($exists) {
                $this->error("❌ Place {$number} existe déjà");
                return 1;
            }
            
            // Créer la place
            $place = Place::create([
                'sector_id' => $sector->id,
                'place_number' => $number,
                'status' => 'available'
            ]);
            
            $this->info("✅ Place créée avec succès!");
            $this->line("   ID: {$place->id}");
            $this->line("   Numéro: {$place->place_number}");
            $this->line("   Secteur: {$place->sector_id}");
            $this->line("   Statut: {$place->status}");
            
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Erreur: ' . $e->getMessage());
            return 1;
        }
    }
}
