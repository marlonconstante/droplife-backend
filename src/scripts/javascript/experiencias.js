var domain = {
    codigo: ko.observable(""),
    descricao: ko.observable(""),
    local: ko.observable(""),
    preco: ko.observable(""),
    parceiro: {
        nome: ko.observable(""),
        contatos: ko.observableArray([
            {
                nome: ko.observable(""),
                telefone: ko.observable("")
            }
        ])
    },
    termos: ko.observableArray([
        {
            descricao: ko.observable("")
        }
    ])
};

var model = {
    selected: domain,
    empty: ko.toJS(domain),
    values: ko.observableArray([]),
    find: function () {
        $.ajax({
            type: "GET",
            url: "/experiencia/pesquisa"
        })
            .done(function (data) {
                data = JSON.parse(data);
                var array = [];
                for (var index = 0; index < data.count; index++) {
                    array.push(data.results[index].value);
                }
                model.values(array);
                model.clear();
            });
    },
    save: function () {
        var value = ko.toJS(model.selected);
        $.ajax({
            type: "POST",
            url: "/experiencia/salvar/" + value.codigo,
            data: JSON.stringify(value)
        })
            .done(function () {
                model.find();
            });
    },
    clear: function () {
        model.update(model.empty);
    },
    exclude: function () {
        var value = ko.toJS(model.selected);
        $.ajax({
            type: "DELETE",
            url: "/experiencia/remover/" + value.codigo
        })
            .done(function () {
                model.find();
            });
    },
    edit: function (value) {
        return function () {
            model.update(value);
        }
    },
    update: function (value) {
        model.selected.codigo(value.codigo);
        model.selected.descricao(value.descricao);
        model.selected.local(value.local);
        model.selected.preco(value.preco);
        model.selected.parceiro.nome(value.parceiro.nome);
        model.selected.parceiro.contatos(model.convertArray(value.parceiro.contatos));
        model.selected.termos(model.convertArray(value.termos));
    },
    convertArray: function (values) {
        var array = [];
        for (var index = 0; index < values.length; index++) {
            var object = {};
            for (propertyName in values[index]) {
                object[propertyName] = ko.observable(values[index][propertyName]);
            }
            array.push(object);
        }
        return array;
    },
    add: function (array, item) {
        return function () {
            array.push(item);
        }
    },
    remove: function (array, item) {
        return function () {
            array.remove(item);
        }
    }
};

model.find();
ko.applyBindings(model);