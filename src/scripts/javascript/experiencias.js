var values = [
    {
        "codigo": "teste",
        "descricao": "RAFTING AVENTURA",
        "local": "Rua Carlos Gomes, 190 - Centro - Três Coroas - RS",
        "preco": "R$ 525,00",
        "parceiro": {
            "nome": "Ecoaventuras",
            "contatos": [
                {
                    "nome": "Édrei",
                    "telefone": "(51) 3546-4466"
                }
            ]
        },
        termos: [
            {
                "descricao": "Tudo que se consumir no parque das laranjeiras só poderá ser pago em dinheiro ou cheque. O local não aceita nenhum tipo de cartão"
            }
        ]
    }
];

var domain = {
    codigo: ko.observable(),
    descricao: ko.observable(),
    local: ko.observable(),
    preco: ko.observable(),
    parceiro: {
        nome: ko.observable(),
        contatos: ko.observableArray([
            {
                nome: ko.observable(),
                telefone: ko.observable()
            }
        ])
    },
    termos: ko.observableArray([
        {
            descricao: ko.observable()
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
            url: "http://localhost:5000/experiencia/pesquisa"
        })
            .done(function (data) {
                data = JSON.parse(data);
                var array = [];
                for (var index = 0; index < data.count; index++) {
                    var value = data.results[index].value;
                    value.codigo = data.results[index].path.key;
                    array.push(value);
                }
                model.values(array);
                model.clear();
            });
    },
    save: function () {
        var value = ko.toJS(model.selected);
        var codigo = value.codigo;
        delete value.codigo;
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/experiencia/salvar/" + codigo,
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
        var codigo = value.codigo;
        delete value.codigo;
        $.ajax({
            type: "DELETE",
            url: "http://localhost:5000/experiencia/remover/" + codigo
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