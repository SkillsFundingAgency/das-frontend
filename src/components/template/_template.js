function Template(template, data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var value = data[key];
            template = template.replace('((' + key + '))', value);
        }
    }
    return template;
}


export default Template