let _defaultSettings = {
    snowFall: false
}

let _clientSettings = null;

export function loadSettings() {
    let _settings = null;
    if (localStorage.getItem('clientSettings')) {
        _settings = JSON.parse(localStorage.getItem('clientSettings'));
    }

    if (!_settings) {
        _settings = _defaultSettings;
    }
    // _settings = Object.assign(_settings, _defaultSettings);
    Object.keys(_defaultSettings).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(_settings, key)) {
            _settings[key] = _defaultSettings[key];
        }
    });

    let validator = {
        set: function (target, key, value) {
            target[key] = value;
            saveSettings();
            return true;
        }
    }

    _clientSettings = new Proxy(_settings, validator);
}

export function saveSettings(settings) {
    _clientSettings = settings;
    localStorage.setItem('clientSettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('settings'));
}

export function getSettings() {
    if(!_clientSettings) {
        loadSettings();
    }

    return _clientSettings;
}