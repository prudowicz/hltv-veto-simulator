// ==UserScript==
// @name         hltv-veto-simulator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Userscript that adds veto simulator dialog at hltv match analytics summary
// @author       prudowicz
// @match        https://www.hltv.org/betting/analytics/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @resource     IMPORTED_CSS http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==



(function() {
    'use strict';


    GM_addStyle ( "                         \
    #veto-button {                         \        \
        float:       right;          \
    }                                   \
    .v-button {                     \
        background-color: #2d6da3;               \
         color: #fff;               \
         padding: 2px 4px;               \
         z-index: 2;               \
         position: relative;               \
         display: inline-block;               \
         border-radius: 4px;               \
         font-size: 12px;            \
         cursor: pointer;      \
}                            \
    .ui-button .ui-icon {         \
        background-image: url('https://code.jquery.com/ui/images/ui-icons_777777_256x240.png') !important;  \
}   \
");
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    var t1_name = $("div.analytics-team-1").text().trim()
    var t2_name = $("div.analytics-team-2").text().trim()

    $("div#maps > h2").append ( `
    <div id="veto-button">

            <button class="v-button">Veto simulator</button>

    </div>
` );



    function showVetoDialog() {
        let top_position = 0.0
        let left_position = 0.0
        let do_dialog_exist = false
        if($(".ui-dialog-titlebar").length) {
            do_dialog_exist = true
            left_position = $("div[role='dialog']").css("left");
            top_position = $("div[role='dialog']").css("top");
        }
        maps_left_out = [].concat(veto_map_pool)
        $("div#veto-dialog").remove();
        $("body").append( '\
    <div id="veto-dialog" style="display: none;"> \
              First pick  <br> \
<input type="radio" id="t1" name="first_pick" value="'+ t1_name + '"' + (first_to_ban===t1_name ? 'checked="checked"' : '') + '>  \
<label for="t1">'+ t1_name + '</label> &nbsp;&nbsp;\
<input type="radio" id="t2" name="first_pick" value="'+ t2_name + '"' + (first_to_ban===t2_name ? 'checked="checked"' : '') + '>  \
<label for="t2">'+ t2_name + '</label> <br> ' + getVetoTable(first_to_ban, second_to_ban, veto_map_pool) + '\
                     </div> \
');


         $( "#veto-dialog" ).dialog();
        if(do_dialog_exist) {
           $("div[role='dialog']").css("left", left_position);
           $("div[role='dialog']").css("top", top_position);
        }

         $('input[name="first_pick"]').change(function() {
             first_to_ban = $('input[name="first_pick"]:checked').val();
             if (first_to_ban == t2_name) {
                 second_to_ban = t1_name;
             }
             else {
                 second_to_ban = t2_name;
             }
             maps_left_out = [].concat(veto_map_pool)
             $('#veto-table').remove();
             $('div#veto-dialog').append(getVetoTable(first_to_ban, second_to_ban, veto_map_pool))
             $('select[name="veto-select"]').on("change", onChangeOfVetoSelect);
         });



        $('select[name="veto-select"]').on("change", onChangeOfVetoSelect);
    };


    $("#veto-button").click(showVetoDialog);

    var first_to_ban = t1_name
    var second_to_ban = t2_name





    var veto_map_pool = [];
    let map_names = document.getElementsByClassName("analytics-map-name");
    for (let i in map_names) {
        let map_name = map_names[i].innerHTML;
        if (map_name && !veto_map_pool.includes(map_name)) {
            veto_map_pool.push(map_name)
        };
    }
    const veto_length = veto_map_pool.length
    var maps_left_out = [].concat(veto_map_pool)

    function getVetoTable(first_to_ban, second_to_ban, veto_map_pool) {
        return '<table id="veto-table" style="width:100%"> \
            <tr>                       \
                <th>Pick</th>             \
                <th>Team</th>            \
                <th>Select</th>          \
            </tr>            \
            <tr>              \
                <td>1st ban</td>         \
                <td>' + first_to_ban + '</td>         \
                <td> <span name="select_span" id="span0">' + getSelectVetoElement(veto_map_pool, 0) + '</span></td>           \
            </tr>            \
            <tr>              \
                <td>2nd ban</td>         \
                <td>' + second_to_ban + '</td>         \
                 <td> <span name="select_span" id="span1">' + getSelectVetoElement(veto_map_pool, 1) + '</span></td>  \
            </tr>            \
            <tr>              \
                <td>1st pick</td>         \
                <td>' + first_to_ban + '</td>         \
                 <td> <span name="select_span" id="span2">' + getSelectVetoElement(veto_map_pool, 2) + '</span></td>  \
            </tr>            \
             <tr>              \
                <td>2nd pick</td>         \
                <td>' + second_to_ban + '</td>         \
                 <td> <span name="select_span" id="span3">' + getSelectVetoElement(veto_map_pool, 3) + '</span></td>  \
            </tr>            \
            <tr>              \
                <td>3th ban</td>         \
                <td>' + first_to_ban + '</td>         \
                 <td> <span name="select_span" id="span4">' + getSelectVetoElement(veto_map_pool, 4) + '</span></td>  \
            </tr>            \
            <tr>              \
                <td>4th ban</td>         \
                <td>' + second_to_ban + '</td>         \
                 <td> <span name="select_span" id="span5">' + getSelectVetoElement(veto_map_pool, 5) + '</span></td>  \
            </tr>            \
            <tr>              \
                <td>Decider</td>         \
                <td>-----</td>         \
                 <td> <span name="select_span" id="span6">' + getSelectVetoElement(veto_map_pool, 6) + '</span></td>  \
            </tr>            \
            </table>            \
                    '
    }

    function getOptionsElement(maps_list) {
        let to_ret = ''
        for (let i in maps_list) {
            to_ret += '<option value="' + maps_list[i] + '">' + maps_list[i] + '</option>'
        }
        return to_ret

    }

    function getSelectVetoElement(maps_left_out, select_id) {
        let to_ret = '<select id="' + select_id + '" name="veto-select">';
        if (maps_left_out.length > 1) {
            to_ret += '<option value="null">----------</option>';
        }
        to_ret +=  getOptionsElement(maps_left_out) + ' </select>';
        return to_ret;

    }

    function onChangeOfVetoSelect() {
            let id = $(this).attr("id");
            let next_id = parseInt(id) + 1
            for(let i = next_id; i < veto_length; i++) {
                 let map_to_remove = $('select#' + id).val();
                 if (map_to_remove === 'null') return;
                 maps_left_out = maps_left_out.filter(e => e !== map_to_remove);
                 $('select#' + i).remove();
                 let span_id = "span" + i
                 $('span#' + span_id).append(getSelectVetoElement(maps_left_out, i));
            }
            $('select[name="veto-select"]').on("change", onChangeOfVetoSelect);
        }

})();
