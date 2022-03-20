$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    var indexEdit = null;

    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }

    $("#btnAddCate").on("click", function (e) {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html()
        })
    })

    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("新增文章分类失败！")
                }
                initArtCateList();
                layer.close(indexAdd);
                layer.msg("新增文章分类成功！");
            }
        })
    })

    $("tbody").on("click", ".btn-edit", function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        })

        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val("form-edit", res.data);
                console.log(res);
            }
        })
    })

    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("更新文章分类失败！");
                }
                initArtCateList();
                layer.close(indexEdit);
                layer.msg("更新文章分类成功！");
            }
        })
    })

    $("tbody").on("click", ".btn-delete", function (e) {
        var id = $(this).attr("data-id");

        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method:"GET",
                url:"/my/article/deletecate/" + id,
                success:function (res) {  
                    if(res.status !=0 ){
                        return layer.msg("删除文章分类失败！");
                    }
                    initArtCateList();
                    layer.close(index);
                    layer.msg("删除文章分类成功！");
                }
            })
        });
    })
})