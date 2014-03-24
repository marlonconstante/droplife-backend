var domain = {
    identificador: ko.observable(""),
    nome: ko.observable(""),
    contatos: ko.observableArray([
        {
            nome: ko.observable(""),
            telefone: ko.observable("")
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
                { mData: "identificador" },
                { mData: "nome" }
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

        $(window).on("resize", function () {
            oTable.fnAdjustColumnSizing();
        });
    },
    find: function () {
        $.ajax({
            type: "GET",
            url: "/parceiro/pesquisa"
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

                var id = $.urlParam("id");
                if (id) {
                    oTable.fnFilter("^" + id + "$", 0, true);
                    oTable.$("tr").trigger("click");
                }
            });
    },
    save: function () {
        var value = ko.toJS(model.selected);
        $.ajax({
            type: "POST",
            url: "/parceiro/salvar/" + value.identificador,
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
            url: "/parceiro/remover/" + value.identificador
        })
            .done(function () {
                model.find();
            });
    },
    update: function (value) {
        value = value || model.empty;

        var oTable = $("table").dataTable({ bRetrieve: true });
        oTable.$("tr.row-editing").removeClass("row-editing");

        model.selected.identificador(value.identificador);
        model.selected.nome(value.nome);
        model.selected.contatos(model.convertArray(value.contatos));
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