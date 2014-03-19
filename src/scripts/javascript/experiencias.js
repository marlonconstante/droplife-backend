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
    init: function () {
        var $table = $("table");

        var oTable = $table.dataTable({
            aoColumns: [
                { mData: "codigo" },
                { mData: "descricao" },
                { mData: "parceiro.nome" },
                { mData: "local" },
                { mData: "preco" }
            ]
        });

        $table.find("tbody").on("click", "tr", function (event) {
            var $tr = $(this);
            var data = oTable.fnGetData(this);
            if (data) {
                if ($tr.hasClass("row-editing")) {
                    model.update();
                } else {
                    model.update(data);
                    $tr.addClass("row-editing");
                }
            }
        });
    },
    find: function () {
        $.ajax({
            type: "GET",
            url: "/experiencia/pesquisa"
        })
            .done(function (data) {
                data = JSON.parse(data);
                var values = [];
                for (var index = 0; index < data.count; index++) {
                    values.push(data.results[index].value);
                }

                var oTable = $("table").dataTable({ bRetrieve: true });
                oTable.fnClearTable();
                oTable.fnAddData(values);

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
        model.update();
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
    update: function (value) {
        value = value || model.empty;

        var oTable = $("table").dataTable({ bRetrieve: true });
        oTable.$("tr.row-editing").removeClass("row-editing");

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

model.init();
model.find();
ko.applyBindings(model);