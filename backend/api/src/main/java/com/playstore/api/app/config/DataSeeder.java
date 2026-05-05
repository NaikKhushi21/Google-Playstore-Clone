package com.playstore.api.app.config;

import com.playstore.api.app.domain.AppEntity;
import com.playstore.api.app.domain.Category;
import com.playstore.api.app.repo.AppRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    @Transactional
    @Order(2)
    CommandLineRunner seedData(AppRepository appRepository) {
        return args -> {
            if (appRepository.count() > 0) return;

            Category games = new Category();
            games.setName("Games");
            games.setSlug("games");

            Category productivity = new Category();
            productivity.setName("Productivity");
            productivity.setSlug("productivity");

            // One productivity app
            AppEntity focusTimer = new AppEntity();
            focusTimer.setName("Focus Timer");
            focusTimer.setDescription("A simple pomodoro timer to boost productivity.");
            focusTimer.setDeveloperName("Acme Labs");
            focusTimer.setIconUrl("https://picsum.photos/seed/focus-timer/128/128");
            focusTimer.setCategories(Set.of(productivity));
            focusTimer.setInstallsCount(18400);

            // 20 games with icons
            List<AppEntity> gamesList = List.of(
                game("Pixel Runner", "Indie Fun", "Retro endless runner game with leaderboards.", "pixel-runner", games),
                game("Galaxy Shooter", "Star Forge", "Arcade space shooter with boss battles.", "galaxy-shooter", games),
                game("Mystic Quest", "Moonlit", "Turn-based RPG through enchanted lands.", "mystic-quest", games),
                game("Dungeon Crawler", "DepthWorks", "Roguelike with procedural dungeons.", "dungeon-crawler", games),
                game("Speed Racer", "TurboTech", "High-octane arcade racing.", "speed-racer", games),
                game("Sky Wars", "Aero Studio", "Dogfights across floating islands.", "sky-wars", games),
                game("Block Builder", "Craftix", "Sandbox building with physics.", "block-builder", games),
                game("Farm Frenzy", "Green Pixel", "Casual farm management sim.", "farm-frenzy", games),
                game("Space Miner", "Orbital Labs", "Mine asteroids and upgrade ships.", "space-miner", games),
                game("Robo Defense", "GigaByte", "Tower defense against robot swarms.", "robo-defense", games),
                game("Word Wizard", "LexiFun", "Spell-binding word puzzles.", "word-wizard", games),
                game("Number Ninja", "CalcCorp", "Math challenges with style.", "number-ninja", games),
                game("Puzzle Path", "Brainwave", "Relaxing path-connecting puzzles.", "puzzle-path", games),
                game("Island Survival", "Driftwood", "Gather, craft, and survive.", "island-survival", games),
                game("City Tycoon", "MetroMind", "Build and manage a bustling city.", "city-tycoon", games),
                game("Battle Chess", "Checkmate Co.", "Classic chess with animated battles.", "battle-chess", games),
                game("Card Clash", "FlipStudios", "Strategic deck-building duels.", "card-clash", games),
                game("Rhythm Beat", "SoundSpark", "Tap to the beat through tracks.", "rhythm-beat", games),
                game("Tower Siege", "Peak Games", "Siege enemy towers with tactics.", "tower-siege", games),
                game("Sea Explorer", "BlueWhale", "Sail, trade, and discover islands.", "sea-explorer", games)
            );

            appRepository.saveAll(gamesList);
            appRepository.save(focusTimer);
        };
    }

    private static AppEntity game(String name, String dev, String desc, String seed, Category games) {
        AppEntity a = new AppEntity();
        a.setName(name);
        a.setDescription(desc);
        a.setDeveloperName(dev);
        a.setIconUrl("https://picsum.photos/seed/" + seed + "/128/128");
        a.setCategories(Set.of(games));
        a.setInstallsCount(500 + Math.abs(seed.hashCode()) % 75000);
        return a;
    }
}

