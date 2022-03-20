$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }

    var q = {
        pagenum: 1, // 页码值，默认请求第 1 页数据
        pagesize: 2, // 每页显示的数据条数，默认每页显示 2 条
        cate_id: "", // 文章分类 Id
        state: "" // 文章发布状态
    };

    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    // 初始化
    initTable();
    initCate();

    function initTable() {

        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("获取文章列表失败！");
                }
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("获取文章分类失败！")
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    $("#form-search").on("submit", function (e) {
        e.preventDefault();

        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();

        q.cate_id = cate_id;
        q.state = state;

        initTable();
    })

    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            jump: function (obj, first) {
                console.log(first);
                console.log(obj.curr);
                // console.log(obj.limit);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $("tbody").on("click", ".layui-btn-delete", function () {
        var id = $(this).attr("data-id");
        var len = $(".layui-btn-delete").length;
        console.log(len);
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg("删除文章失败！")
                    }
                    layer.msg("删除文章成功！");
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})