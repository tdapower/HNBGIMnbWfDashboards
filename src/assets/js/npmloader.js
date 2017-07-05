define({
    normalize: function(name, normalize) {
        return name;
    },
    load: function(name, req, onload, config) {
        require(name);
    }
});