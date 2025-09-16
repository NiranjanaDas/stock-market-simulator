const os = require('os')
const { exec } = require('child_process')
const config = require('../../config/default.json')
const colors = require('../utils/colors')

class SoundService {
    static playSound(type) {
        if (!config.sound.enabled) return

        const platform = os.platform()

        switch (type.toLowerCase()) {
            case 'success':
                this.playSuccessSound(platform)
                break
            case 'error':
                this.playErrorSound(platform)
                break
            case 'notification':
                this.playNotificationSound(platform)
                break
            case 'trade':
                this.playTradeSound(platform)
                break
            case 'news':
                this.playNewsSound(platform)
                break
            case 'startup':
                this.playStartupSound(platform)
                break
            case 'menu':
                this.playMenuSound(platform)
                break
            default:
                this.playDefaultSound()
        }
    }

    static playSuccessSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('✅')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemAsterisk')
            } else if (platform === 'darwin') {
                this.playMacSound('Glass')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playErrorSound(platform) {
        if (config.sound.useTerminalBell) {
            this.terminalBell()
            this.terminalBell()
        }
        if (config.sound.useVisualEffects) this.visualEffect('❌')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemHand')
            } else if (platform === 'darwin') {
                this.playMacSound('Basso')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playNotificationSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('🔔')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemNotification')
            } else if (platform === 'darwin') {
                this.playMacSound('Ping')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playTradeSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('💰')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemAsterisk')
            } else if (platform === 'darwin') {
                this.playMacSound('Tink')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playNewsSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('📰')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemExclamation')
            } else if (platform === 'darwin') {
                this.playMacSound('Submarine')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playDefaultSound() {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('🔊')
    }

    static terminalBell() {
        process.stdout.write('\x07')
    }

    static visualEffect(icon) {
        process.stdout.write(`\r${icon} `)
        setTimeout(() => {
            process.stdout.write('\r  \r')
        }, 500)
    }

    static playWindowsSound(soundName) {
        const sounds = {
            'SystemAsterisk': 'Windows Ding.wav',
            'SystemHand': 'Windows Critical Stop.wav',
            'SystemNotification': 'Windows Notify.wav',
            'SystemExclamation': 'Windows Exclamation.wav',
            'SystemStart': 'Windows Logon.wav'
        }
        
        const actualSound = sounds[soundName] || 'Windows Ding.wav'
        
        try {
            exec(`powershell.exe -Command "try { (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\${actualSound}').PlaySync() } catch { [Console]::Beep(800, 200) }"`, { windowsHide: true })
        } catch (error) {
            this.terminalBell()
        }
    }

    static playMacSound(soundName) {
        const sounds = {
            'Glass': 'Glass.aiff',
            'Basso': 'Basso.aiff',
            'Ping': 'Ping.aiff',
            'Tink': 'Tink.aiff',
            'Submarine': 'Submarine.aiff'
        }
        
        const actualSound = sounds[soundName] || 'Glass.aiff'
        
        try {
            exec(`afplay /System/Library/Sounds/${actualSound} 2>/dev/null || say -v Zarvox "beep"`)
        } catch (error) {
            this.terminalBell()
        }
    }

    static playLinuxSound(soundName) {
        const commands = [
            'paplay /usr/share/sounds/alsa/Front_Left.wav',
            'aplay /usr/share/sounds/alsa/Front_Left.wav',
            'speaker-test -t sine -f 800 -l 1 -c 1',
            'beep -f 800 -l 200',
            'echo -e "\\a"'
        ]
        
        this.tryCommands(commands, 0)
    }
    
    static tryCommands(commands, index) {
        if (index >= commands.length) {
            this.terminalBell()
            return
        }
        
        exec(commands[index], (error) => {
            if (error && index < commands.length - 1) {
                this.tryCommands(commands, index + 1)
            }
        })
    }

    static playCustomSound(frequency = 800, duration = 200) {
        this.terminalBell()

        if (os.platform() === 'win32') {
            try {
                exec(`powershell.exe -Command "[console]::beep(${frequency},${duration})"`, { windowsHide: true })
            } catch (error) {
            }
        }
    }

    static playStartupSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('🚀')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemStart')
            } else if (platform === 'darwin') {
                this.playMacSound('Glass')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static playMenuSound(platform) {
        if (config.sound.useTerminalBell) this.terminalBell()
        if (config.sound.useVisualEffects) this.visualEffect('⚡')

        if (config.sound.useSystemSounds) {
            if (platform === 'win32') {
                this.playWindowsSound('SystemNotification')
            } else if (platform === 'darwin') {
                this.playMacSound('Ping')
            } else {
                this.playLinuxSound('bell')
            }
        }
    }

    static createSoundSequence(sequence) {
        sequence.forEach((sound, index) => {
            setTimeout(() => {
                this.playSound(sound.type)
            }, index * sound.delay)
        })
    }
}

module.exports = SoundService