require(['jquery'], function($) {

    // DOCS: http://www.wunderground.com/weather/api/d/docs 
    // ANALYTICS: http://www.wunderground.com/weather/api/
    var w_url = 'https://api.wunderground.com/api/05f016985c202a7e/forecast/conditions/q/WI/Madison.json';

    // retrieve json
    function getWeather(callback) {
        $.ajax({
            dataType: "jsonp",
            url: w_url,
            success: parseWeather
        });
    };

    // parse json
    function parseWeather(data) {

        var w_temp_current = Math.ceil(data.current_observation.temp_f)+'&deg;',
            w_temp_high = Math.ceil(data.forecast.simpleforecast.forecastday[0].high.fahrenheit)+'&deg;',
            w_temp_low = Math.ceil(data.forecast.simpleforecast.forecastday[0].low.fahrenheit)+'&deg;',
        	w_icon = data.current_observation.icon,
            w_wind = Math.ceil(data.current_observation.wind_mph),
        	w_icon_class = '';

        // console.log('w_icon: '+w_icon);

        // Write temperatures
        $('#w_temp_current_js').html(w_temp_current);
        $('#w_temp_high_js').html(w_temp_high);
    	$('#w_temp_low_js').html(w_temp_low);

        // Check if icon is present
        if (!w_icon == '') {
            // If wind >= 25 mph && not during thunderstorm, snow, flurries, sleet, nor rain then show windy icon
            if ((w_wind >= 25) &&
                (
                w_icon == 'chanceofathunderstorm' ||
                w_icon == 'chanceofrain' || 
                w_icon == 'chanceofflurries' || 
                w_icon == 'chanceofsnow' ||
                w_icon == 'chanceofsleet' || 
                w_icon == 'hazy' ||
                w_icon == 'sunny' || 
                w_icon == 'mostlysunny' ||
                w_icon == 'clear' ||
                w_icon == 'partlysunny' ||
                w_icon == 'partlycloudy' ||
                w_icon == 'cloudy' ||
                w_icon == 'mostlycloudy' ||
                w_icon == 'unknown'
                )
            ) {
                // icon_weather_windy
                w_icon_class = 'icon_weather_windy';
            } else {
            	// icon_weather_lightning
        		if (w_icon == 'thunderstorm' || w_icon == 'chanceofathunderstorm') {
        			w_icon_class = 'icon_weather_lightning';
        		}
        		// icon_weather_rainy_light
        		if (w_icon == 'chanceofrain') {
        			w_icon_class = 'icon_weather_rainy_light';
        		}
        		// icon_weather_rainy
        		if (w_icon == 'rain') {
        			w_icon_class = 'icon_weather_rainy';
        		}
                // icon_weather_snowy_light
                if (w_icon == 'chanceofflurries' || w_icon == 'flurries') {
                    w_icon_class = 'icon_weather_snowy_light';
                }
        		// icon_weather_snowy
        		if (w_icon == 'snow' || w_icon == 'chanceofsnow' || w_icon == 'sleet' || w_icon == 'chanceofsleet') {
        			w_icon_class = 'icon_weather_snowy';
        		}
        		// icon_weather_fog
        		if (w_icon == 'hazy') {
        			w_icon_class = 'icon_weather_fog';
        		}
        		// icon_weather_sunny
        		if (w_icon == 'sunny' || w_icon == 'mostlysunny' || w_icon == 'clear') {
        			w_icon_class = 'icon_weather_sunny';
        		}
        		// icon_weather_cloudy_mostly
        		if (w_icon == 'partlysunny' || w_icon == 'partlycloudy') {
        			w_icon_class = 'icon_weather_cloudy_mostly';
        		}
        		// icon_weather_cloudy
        		if (w_icon == 'cloudy' || w_icon == 'mostlycloudy') {
        			w_icon_class = 'icon_weather_cloudy';
        		}
            }
        }

        // Add weather icon
        $('#w_icon_js').addClass(w_icon_class);

        // Unhide weather container
        $('#w_js').removeClass('hidden', 50);
    };

    // Initialize Weather JSON
    getWeather();

});