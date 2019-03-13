// For status change //
function statusChangeFunction(type, element) {

    swal({
        title: "Are you sure?",
        text: "But you will still be able to retrieve this data.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, status change it!",
        cancelButtonText: "No, cancel please!",

    }).then(function () {
        statusModifier(type, element);
    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your data is safe :)',
                'error'
            )
        }
    }).catch(swal.noop);
}

function statusModifier(type, element) {
    var id = $(element).attr('data-team');
    var url = apiBaseURL + "/" + type + "/status-change";
    var redirect_url = apiBaseURL + "/" + type + "/list";
    $.ajax({
        url: url,
        type: "POST",
        data: {
            "id": id
        },
        success: function (msg) {
            if (msg) {
                location.href = redirect_url;
            }
        }
    });
}
// For status change //

// For delete data //
$(document).on("click", ".delete", function (event) {
    var redirect_url = $(this).attr('href');
    event.preventDefault(); // prevent form submit
    swal({
        title: "Are you sure?",
        type: "error",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",

    }).then(function () {
        location.href = redirect_url;
    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your data is safe :)',
                'error'
            )
        }
    }).catch(swal.noop);

})
//Creator AutoComplete Search
$(document).ready(function () {

    CKEDITOR.replaceClass = 'ckeditor';


    $('#creator_select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '300px',
    });
    $('#teacher_select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '300px',
    });
});
//End Creator AutoComplete Search




// Allow only decimal number //
// $('.allownumericwithdecimal').on('input', function () {
//     this.value = this.value
//         .replace(/[^\d.]/g, '') // numbers and decimals only
//         //.replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 2 digits at the beginning
//         .replace(/(\..*)\./g, '$1') // decimal can't exist more than once
//         .replace(/(\.[\d]{2})./g, '$1'); // not more than 4 digits after decimal
// });
/*$(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
    
    
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});*/

//ONLY FOR USER_PROFILE PAGE
$('.attribute').on('ifChecked ifUnchecked', function (event) {
    $('.attribute').valid();
    var getTextBoxId = "#attr_val_" + $(this).attr('data-id');
    if (event.type == 'ifChecked') {
        $(getTextBoxId).show();
    } else {
        $(getTextBoxId).parent()
            .find("em.invalid")
            .remove();
        $(getTextBoxId).val('');
        $(getTextBoxId).hide();

    }
});

/////  FOR Event Image Prevention ///////
$("#event_image_image").on("change", function (event) {
    var size = $(this).attr('data-team');
    var ext = $(this).val().split('.').pop().toLowerCase();
    if ($("#event_image_image")[0].files.length > size) {
        $(this).val('');
        $(".msg").text('Please Select Upto ' + size + ' Images');
    } else if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'x-ms-bmp']) == -1) {
        $(this).val('');
        $(".msg").text('Invalid Image Type');
    } else {
        $(".msg").text('');
    }
});
//for prventing first character to be space 
$("input").on("keypress", function (e) {
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
        e.preventDefault();
});
$("textarea").on("keypress", function (e) {
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
        e.preventDefault();
});


//Delete Image
$(document).on("click", ".img_delete", function (event) {
    event.preventDefault();
    var url = $(this).attr('href');
    var redirect_url = window.location.href;
    var id = redirect_url.substring(redirect_url.lastIndexOf('/') + 1);
    var img = $(this).attr('data-team');
    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, cancel please!",

    }).then(function () {
        $.ajax({
            url: url,
            type: "POST",
            data: {
                "id": id,
                img_name: img
            },
            success: function (msg) {
                if (msg) {
                    location.href = redirect_url;
                }
            }
        });

    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your data is safe :)',
                'error'
            )
        }
    }).catch(swal.noop);

});
//for banner Image Selection
$('input[name="banner_image"]').on('click', function (event) {
    if ($(this).attr('id') == 'existing_image') {

        $(".ex_img_0").prop("checked", true);
        $("#existing_banner_img").show();
        $('#event_img').hide();
        $('#event_video').hide();
        $('#type').val('exist_image');
    } else if ($(this).attr('id') == 'banner_image') {
        $(".ex_img_0").prop("checked", false);
        $('#existing_banner_img').hide();
        $('#event_img').show();
        $('#event_video').hide();
        $('#type').val('image');

    } else if ($(this).attr('id') == 'banner_video') {
        $(".ex_img_0").prop("checked", false);
        $('#existing_banner_img').hide();
        $('#event_img').hide();
        $('#event_video').show();
        $('#type').val('video');
    } else {
        $(".ex_img_0").prop("checked", false);
        $('#existing_banner_img').hide();
        $('#event_img').hide();
        $('#event_video').hide();
    }
});

$(document).on("change", "#event_image_image", function (event) {
    var ext = $(this).val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'x-ms-bmp']) == -1) {
        $(this).val('');
        $(".img_msg").text('Invalid Image Type');

    } else {
        $(".img_msg").text('');

    }
});
$(document).on("change", "#event_image_video", function (event) {
    var ext = $(this).val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['x-flv', 'mp4', 'x-mpegURL', 'MP2T', '3gpp', 'quicktime', 'x-msvideo', 'x-ms-wmv']) == -1) {
        $(this).val('');
        $(".video_msg").text('Invalid Video Type.');

    } else {
        $(".video_msg").text('');

    }
});
//Date picker
/*$('#start_date').pickadate({
    today: '',
    format: 'yyyy/mm/dd',
    close: 'Close Picker',
    clear: ''
});
$('#end_date').pickadate({
    today: '',
    format: 'yyyy/mm/dd',
    close: 'Close Picker',
    clear: ''
});
// Basic time
$('#start_time').pickatime();
$('#end_time').pickatime();

$('#date_of_birth').pickadate({
    today: '',
    format: 'yyyy/mm/dd',
    close: 'Close Picker',
    clear: '',
    onSet: function() {
        console.log('set new date')
    }
});*/
$('#date_of_birth').pickadate({
    width: '600',
    format: 'yyyy-mm-dd',
    close: 'Close Picker',
    selectYears: 98,
    selectMonths: true,
    max: true,
    clear: '',
})
$('#starting_time').pickatime();



/* Page: Subscription */
$('.c_datepicker').pickadate({
    width: '600',
    format: 'yyyy-mm-dd',
    close: 'Close Picker',
    selectYears: 70,
    selectMonths: true,
    clear: ''
});


/* Page: Student Create */
function showSubscriptionDetail(v, subs) {
    if (v != '') {
        var url = apiBaseURL + "/subscription/detail/" + v;
        $.ajax({
            url: url,
            type: "GET",
            success: function (res) {
                //$('#allowedClassSelectionNum').val(res.data.number_of_class);
                $("#no_of_class_dsp" + subs).html(res.data.number_of_class);
                $("#duration_dsp" + subs).html(res.data.duration + ' month(s)');
                $("#price_dsp" + subs).html(res.data.price);
                //$("#split_payment_dsp").html(res.data.split_payment.toUpperCase());
                if (res.data.split_payment_number == 1) {
                    $("#split_payment_dsp" + subs).html('No');
                } else {
                    $("#split_payment_dsp" + subs).html('Yes');
                }

                $('#studentClassSelection' + subs).css("display", "block");
                $("#subscriptionBlock" + subs).css("display", "block");
            },
            error: function () {
                //$('#notification-bar').text('An error occurred');
            }
        });
    } else {

        $("#studentClassSelection" + subs).css("display", "none");
        $("#subscriptionBlock" + subs).css("display", "none");
    }
}
$(document).ready(function () {


    $('.userProfileG').viewbox();
    $('.postGallery').viewbox();

    $('.multiselect_chkbox').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
    });

    if ($('#studentClassSelection1').length > 0) {
        if ($('#paired_subscription1').val() != '') {
            $('#studentClassSelection1').show();
        } else {
            $('#studentClassSelection1').hide();
        }
    }


    if ($('#paired_subscription1').length > 0) {
        $('#paired_subscription1').change(function () {
            if ($('#paired_subscription1').val() != '') {
                $('#studentClassSelection1').show();
            } else {
                $('#studentClassSelection1').hide();
            }
        });
    }
});

function addMoreSubscription() {
    //alert($('#subscription_num').val());
    var v = parseInt($('#subscription_num').val());
    $('#subscription_num').val(v + 1);

    $("#remSubBtn").css("display", "block");

    var url = apiBaseURL + "/student/getsubscriptionhtmlinfo/" + (v + 1);
    $.ajax({
        url: url,
        type: "GET",
        success: function (res) {
            //$('#studentClassSelection'+(v+1)).show();
            $(res.data).insertAfter($("#subscriptionBlock" + v));

            $('.multiselect_chkbox').multiselect({
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                buttonWidth: '100%',
            });
            $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
        },
        error: function () {
            //$('#notification-bar').text('An error occurred');
        }
    });
}

function remSubscription() {
    var v = parseInt($('#subscription_num').val());
    $("#subscriptionBlock" + v).prev().remove();
    $("#subscriptionBlock" + v).remove();

    $('#subscription_num').val(v - 1);

    if (v == 2) {
        $("#remSubBtn").css("display", "none");
    }

}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var class_id_dtbl = $('#class_id_dtbl').val();

        return true;
    }
);


//transaction rider and  driver filteration

$("#userType").change(function () {
    if (this.value === 'driver' && this.value != 'rider') {
        $("#driverDrp").removeClass('hide')
        $("#riderDrp").addClass('hide')

    } else if (this.value === 'rider' && this.value != 'driver') {
        $("#riderDrp").removeClass('hide')
        $("#driverDrp").addClass('hide')

    }

})


// Allow only decimal number //    

$(".allownumericwithdecimals").on("keypress keyup blur", function (event) {
    //this.value = this.value.replace(/[^0-9\.]/g,'');
    var ignoredKeys = [8, 9, 37, 38, 39, 40];
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if (ignoredKeys.indexOf(event.which) >= 0) {
        return true;
    } else if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$("#uploadCSV").on("change", function (e) {
    var file = $(this)[0].files[0];
    var upload = new Upload(file);

    // maby check size or type here with upload.getSize() and upload.getType()

    // execute upload
    upload.doUpload();
});


var Upload = function (file) {
    this.file = file;
};

Upload.prototype.getType = function () {
    return this.file.type;
};
Upload.prototype.getSize = function () {
    return this.file.size;
};
Upload.prototype.getName = function () {
    return this.file.name;
};
Upload.prototype.doUpload = function () {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("product", this.file, this.getName());

    $.ajax({
        type: "POST",
        url: apiBaseURL + "/product/import",
        success: function (data) {
            // console.log(data)
            toastr.success(data.message, 'Success!', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        },
        error: function (error) {
            toastr.error(error.message, 'Error!', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
};

// Line Chart 2 Starts
if ($('#line-chart2').length > 0) {

    // console.log(document.location.pathname);
    // console.log();
    const link = document.location.pathname.substring(document.location.pathname.lastIndexOf('/') + 1);
    const url = apiBaseURL + "/product/stat";
    const params = link.split('_');
    $.ajax({
        url: url,
        type: "POST",
        data: {
            "product_id": params[0],
            "competitor": params[1]
        },
        success: function (success) {

            var today = new Date();
            var priorDate = new Date().setDate(today.getDate()-30);

            var lineChart2 = new Chartist.Line('#line-chart2', {
                labels: getDateArray(priorDate, today),
                series: [
                    success.data
                ]
            }, {
                    axisX: {
                        showGrid: false,
                    },
                    axisY: {
                        low: 0,
                        scaleMinSpace: 50,
                    },
                    fullWidth: true,
                    chartPadding: { top: 0, right: 25, bottom: 0, left: 0 },
                },
                [
                    ['screen and (max-width: 640px) and (min-width: 381px)', {
                        axisX: {
                            labelInterpolationFnc: function (value, index) {
                                return index % 2 === 0 ? value : null;
                            }
                        }
                    }],
                    ['screen and (max-width: 380px)', {
                        axisX: {
                            labelInterpolationFnc: function (value, index) {
                                return index % 3 === 0 ? value : null;
                            }
                        }
                    }]
                ]);

            lineChart2.on('draw', function (data) {
                var circleRadius = 6;
                if (data.type === 'point') {
                    var circle = new Chartist.Svg('circle', {
                        cx: data.x,
                        cy: data.y,
                        r: circleRadius,
                        class: 'ct-point-circle'
                    });
                    data.element.replace(circle);
                }
            });


        }
    });
}

function formatDate(dateObject) {
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = monthName[d.getMonth()];
    var year = d.getFullYear().toString().substr(2, 2);
    if (day < 10) {
        day = "0" + day;
    }
    // if (month < 10) {
    //     month = "0" + month;
    // }
    var date = day + " " + month;

    return date;
};

function getDateArray(start, end) {

    var
        arr = new Array(),
        dt = new Date(start);

    while (dt <= end) {
        arr.push(formatDate((new Date(dt))));
        dt.setDate(dt.getDate() + 1);
    }

    return arr;

}

// Line Chart 2 Ends

// custom pagination for all products start

if ($('#dv_allproduct').length > 0) {

    var from_$input = $('#txt_startdate').pickadate({
        format: 'yyyy-mm-dd',
        max: new Date()
    }),
        from_picker = from_$input.pickadate('picker')

    var to_$input = $('#txt_enddate').pickadate({
        format: 'yyyy-mm-dd',
        max: new Date()
    }),
        to_picker = to_$input.pickadate('picker')


    // When something is selected, update the “from” and “to” limits.
    from_picker.on('set', function (event) {
        if (event.select) {
            to_picker.set('min', from_picker.get('select'))
        }
        else if ('clear' in event) {
            to_picker.set('min', false)
        }
    })
    to_picker.on('set', function (event) {
        if (event.select) {
            from_picker.set('max', to_picker.get('select'))
        }
        else if ('clear' in event) {
            from_picker.set('max', false)
        }
    })


    $('#btnreset').click(function (e) {
        e.preventDefault();
        if ($('#selectCategory').val() != null)
            $('#selectCategory').val(null).trigger('change');
    });

    $('#selectCategory').select2({
        ajax: {
            url: apiBaseURL + '/product/category',
            data: function (params) {
                return {
                    search: params.term,
                    page: params.page || 1
                }
            },
            processResults: function (response, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                return {
                    results: response.data,
                    pagination: {
                        more: (params.page * 30) < response.data.length
                    }
                };
            },
            cache: true
        },
        placeholder: 'Search for a category',
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 5,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });


    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.name + "</div>";
        "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        $('#pagination').pagination({
            current: 1,
            length: 10,
            // size: 2,
            prev: 'Prev',
            next: 'Next',

            ajax: function (options, refresh, $target) {
                $.ajax({
                    type: "POST",
                    url: apiBaseURL + "/product/view_all?category=" + repo.name,
                    data: {
                        current: (options.current * options.length) - options.length,
                        length: options.length
                    },
                    dataType: 'json'
                }).done(function (res) {
                    $("#tbl_allproduct tbody").html('');
                    if (res.data.hits.hits.length > 0) {
                        res.data.hits.hits.forEach(element => {
                            let trhtml = '';
                            trhtml += '<tr>';
                            trhtml += '<td><div style="width:300px;">' + element._source.product_name + '</div></td>';
                            trhtml += '<td>' + element._source.product_sku + '</td>';
                            trhtml += '<td><img src="' + element._source.images[0].src + '" width="100" height="100" /></td>';
                            trhtml += '<td>' + element._source.regular_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.sale_price.toFixed(2) + '</td>';

                            // competitor 1 details
                            trhtml += '<td>' + element._source.comp1_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp1_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp1_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp1_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp1_diff_perce.toFixed(2) + '</td>';

                            // competitor 2 details
                            trhtml += '<td>' + element._source.comp2_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp2_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp2_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp2_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp2_diff_perce.toFixed(2) + '</td>';

                            // competitor 3 details
                            trhtml += '<td>' + element._source.comp3_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp3_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp3_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp3_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp3_diff_perce.toFixed(2) + '</td>';

                            // competitor 4 details
                            trhtml += '<td>' + element._source.comp4_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp4_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp4_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp4_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp4_diff_perce.toFixed(2) + '</td>';


                            trhtml += '</tr>';

                            $("#tbl_allproduct tbody").append(trhtml);
                        });

                        refresh({
                            total: res.data.hits.total,
                            length: 10
                        });
                    } else {
                        let trhtml = '';
                        trhtml += '<tr><td colspan="20">No result found<td></tr>';
                        $("#tbl_allproduct tbody").append(trhtml);

                        refresh({
                            total: 0,
                            length: 10
                        });
                    }

                }).fail(function (error) {

                });
            }
        });

        return repo.name || repo.text;
    }

    $('#btnViewAll').click(function () {
        $('#txt_searchbox').val('');
        $('#btnSearch').trigger('click');
    });

    $('#btnSearch').click(function () {
        $('#pagination').pagination({
            current: 1,
            length: 10,
            // size: 2,
            prev: 'Prev',
            next: 'Next',

            ajax: function (options, refresh, $target) {
                $.ajax({
                    type: "POST",
                    url: apiBaseURL + "/product/byNameorSku",
                    data: {
                        search: $('#txt_searchbox').val(),
                        current: (options.current * options.length) - options.length,
                        length: options.length
                    },
                    dataType: 'json'
                }).done(function (res) {
                    $("#tbl_allproduct tbody").html('');
                    if (res.data.hits.hits.length > 0) {
                        res.data.hits.hits.forEach(element => {
                            let trhtml = '';
                            trhtml += '<tr>';
                            trhtml += '<td><div style="width:300px;">' + element._source.product_name + '</div></td>';
                            trhtml += '<td>' + element._source.product_sku + '</td>';
                            trhtml += '<td><img src="' + element._source.images[0].src + '" width="100" height="100" /></td>';
                            trhtml += '<td>' + element._source.regular_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.sale_price.toFixed(2) + '</td>';

                            // competitor 1 details
                            trhtml += '<td>' + element._source.comp1_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp1_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp1_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp1_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp1_diff_perce.toFixed(2) + '</td>';

                            // competitor 2 details
                            trhtml += '<td>' + element._source.comp2_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp2_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp2_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp2_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp2_diff_perce.toFixed(2) + '</td>';

                            // competitor 3 details
                            trhtml += '<td>' + element._source.comp3_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp3_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp3_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp3_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp3_diff_perce.toFixed(2) + '</td>';

                            // competitor 4 details
                            trhtml += '<td>' + element._source.comp4_product_price.toFixed(2) + '</td>';
                            trhtml += '<td>' + element._source.comp4_product_price_retail.toFixed(2) + '</td>';
                            trhtml += '<td><div style="position:relative;">';
                            trhtml += element._source.comp4_diff_price.toFixed(2);
                            trhtml += '<div class="arrow-icon">';
                            if (element._source.comp4_diff_price > 0) {
                                trhtml += '<img src="../images/up_arrow.png" />';
                            } else {
                                trhtml += '<img src="../images/down_arrow.png" />';
                            }
                            trhtml += '</div></div></td>';
                            trhtml += '<td>' + element._source.comp4_diff_perce.toFixed(2) + '</td>';


                            trhtml += '</tr>';

                            $("#tbl_allproduct tbody").append(trhtml);
                        });

                        refresh({
                            total: res.data.hits.total,
                            length: 10
                        });
                    } else {
                        let trhtml = '';
                        trhtml += '<tr><td colspan="20">No result found<td></tr>';
                        $("#tbl_allproduct tbody").append(trhtml);

                        refresh({
                            total: 0,
                            length: 10
                        });
                    }

                });
            }
        });
    })
}

// custom pagination for all products end







