$(document).ready(function () {

    /* Bloqueo de pantalla*/
    /*   $(document).bind('contextmenu', function(event) {
           return false;
       });*/

    let token = $('body').data('token');
    let invitado = $('body').data('tokeninvitado');
    var numero_invit = 0;
    var numeroIn = 10;
    var publico = false;
    let invActualizada = "1";
    var invitacion = 0;
    var invitados = [];
    $.ajax({
        url: "https://convitevent.com/tipo-invitacion",
        type: "POST",
        data: {token:token,invitado:invitado,invActualizada:invActualizada},
        dataType: "json"
    }).done(function (r) {
        if (r['status']) {

            invitacion = r['enviado'];
            numero_invit = r['invimax'];
            numeroIn = (r['invimax'] == 0) ? 10 :r['invimax'] ;
            invitados = r['invitados'];


            $('#nombre').val(r['nombre']);
            $('#invitacionPara').text(r['nombre']);
            $('#email').val(r['correo']);
            $('.nombre').text(r['nombre']);
            $('#boletitosRestantes').text(numeroIn);
            $('#boletitosTotales').text(numeroIn);
            if (r['invimax'] > 1){
                $('#boletoSP').text('Boletos disponibles');
            }else{
                $('#boletoSP').text('Boleto disponible');
            }



            if (r['invimax'] > 0){
                console.log("3")
                $("#ejemplo-confirmar").remove();
                var contador = 1;
                for (var i = 0; i < numeroIn; i++) {
                    if (invitados[i]['nombreInvitado'] != "") {
                        $("#invitados").append('<div class="row boleto">\n' +
                            '<div class="col-md-8 py-1" id="invitado">\n' +
                            '    <div class="select-itms" >\n' +
                            '        <div class="form-box subject-icon">\n' +
                            '            <label for="invitado"><h5>Invitado<span style="position: absolute; left: 70%;"">Boleto # '+contador+'<b></b></h5></span></label>' +
                            '            <h3 class="invitado-l">'+ invitados[i]['nombreInvitado'] +'</h3>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="col-md-4 py-1" id="invitado">\n' +
                            '        <div class="select-itms centrar" >\n' +
                            '            <div class="form-box subject-icon">\n' +
                            '                <label for="invitado" class="text-center w-100"><h3 class="text-center">Asistirá</h3></span> </label>\n' +
                            '               <div class="centrar">' +
                            '                   <input type="checkbox" name="asistencia" placeholder="asistencia" class="asistencia" value="1">\n' +
                            '               </div>\n' +
                            '               <p><small>Marque esta casilla para confirmar su asistencia</small></p>\n' +
                            '            </div>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '</div>');
                    }else{
                        $("#invitados").append('' +
                            '<div class="row boleto">\n' +
                            '<div class="col-md-8 py-1" id="invitado">\n' +
                            '    <div class="select-itms" >\n' +
                            '        <div class="form-box subject-icon">\n' +
                            '            <label for="invitado"><h5>Invitado<span style="position: absolute; left: 70%;"">Boleto # '+contador+'<b></b></h5></span> </label>\n' +
                            '            <input type="text" class="holder invitado-i my-5" placeholder="Nombre">\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="col-md-4 py-1" id="invitado">\n' +
                            '        <div class="select-itms centrar" >\n' +
                            '            <div class="form-box subject-icon">\n' +
                            '                <label for="invitado" class="text-center w-100"><h3 class="text-center">Asistirá</h3></span> </label>\n' +
                            '               <div class="centrar">' +
                            '                   <input type="checkbox" name="asistencia" placeholder="asistencia" class="asistencia" value="1">\n' +
                            '               </div>\n' +
                            '               <p><small>Marque esta casilla para confirmar su asistencia</small></p>\n' +
                            '            </div>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            ' </div>');
                    }
                    contador++;
                }
            }else{
                console.log("2")
                $("#confirmar").remove()
                $("#ejemplo-confirmar").show();
            }

            if(r['nombre'] == ''){
                $('.etiqueda').css('display','none')
            }

            if(invitacion == 1){
                $('#datosboda').css('display','none');
                $('.c-0').show().text(r['nombre']);
                $('.c-1').text('Respuesta enviada');
                var asistencia = '';

                for (x=0; x < r['invitados'].length; x++){
                    if (r['invitados'][x]['asistencia'] === "0"){
                        asistencia = 'No Asistirá';
                    }
                    if (r['invitados'][x]['asistencia'] === "1"){
                        asistencia = 'Asistirá';
                    }
                    $('#listaInivtados').append('<li>'+r['invitados'][x]['nombreInvitado']+' - '+asistencia+'</li>');
                }
                $('#qrPase').attr('src', 'qr_invitados/'+r['qr']);
                $('#paseEntrada').show();

                console.log("1")
                $("#ejemplo-confirmar").remove();
            }

        } else {
            //window.location.href = "http://convitevent.com/404";
        }

    }).fail(function () {

    });

    $('#enviar_eventos').on('click', function (e) {
        e.preventDefault();
        let datos = new FormData($('#datosboda')[0]);
        var invitadosReservados = $('.invitado-l');
        var invitadosNuevos = $('.invitado-i');
        var asistencias = $('.asistencia');
        var invitados = [];
        var x = 0;

        for (i=0; i < asistencias.length; i++){

            if (i < invitadosReservados.length){/*Boletos reservados*/
                var inv = {'nombre':invitadosReservados[i].innerText, 'asist': asistencias[i].checked}

            }else{ /*Boletos nuevos*/
                var inv = {'nombre':invitadosNuevos[x].value, 'asist': asistencias[i].checked}
                x++;
            }

            invitados.push(inv);
        }
        var jsonstring = JSON.stringify(invitados);

        datos.append('t_invitacion', token);
        datos.append('t_invitado', invitado);
        datos.append('t_invitados', jsonstring);

        bloquearPantalla('Confirmando Asistencia...');
        $('.remove-this').remove();
        if (!validarNombre(datos, 'name' )){
            return false;
        }else{
            fetch('php/boda-datos.php',{
                method: 'POST',
                body: datos,
                dataType: 'JSON'
            }).then(response => response.json()).then(data => {
                if (data['response'] == true) {
                    desbloquearPantalla();
                    alertify.alert("","Asistencia Confirmada.");
                    setTimeout(function(){
                        window.location.reload(1);
                    }, 3000);

                }else{
                    desbloquearPantalla();
                    $.each(data, function (k, v) {
                        var padre = $("#" + k).parents('div');
                        $(padre[0]).addClass("resaltar");
                        $("#" + k).after("<p class='text-danger remove-this'>" + v + "</p>");
                    })
                }

            });
        }
    });
});


function bloquearPantalla(texto){

    $.blockUI({
        message:  (texto == null) ? '' : '<h2 class="text-white">'+texto+'</h2>'+
            '<p class="text-white text-center"><small>No recarge ni cierre esta página</small></p>',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#df8f84',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            color: '#fff',
            width: '80%',
            left: '10%'
        } });
}

function desbloquearPantalla(){
    setTimeout($.unblockUI, 10);
}


function validarNombre(datos,id, anfitrion = ''){
    if (datos.get(id) == ''){
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un nombre "+anfitrion+"</p>");
        return false;
    }else if ( datos.get(id) == null ) {
        return true;
    }else if(!datos.get(id).match(/^[0-9a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_\s]+$/)){
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un nombre "+anfitrion+" valido</p>");
        return false;
    }else{
        return true;
    }
}

function validaCorreo(datos,id){
    if (datos.get(id) == '') {
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un correo</p>");
        return false;
    }else if (!datos.get(id).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un correo valido</p>");
        return false;
    }else{
        return true;
    }
}

function validaTelefono(datos,id){
    if (datos.get(id) == '') {
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un teléfono</p>");
        return false;
    }else if (!datos.get(id).match(/^\d{10}$/)) {
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>Ingrese un teléfono valido</p>");
        return false;
    }else{
        return true;
    }
}

function validarDatosNulos(datos,id,mensaje) {
    if (datos.get(id) == ''){
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>"+mensaje+"</p>");
        return false;
    }else{
        return true;
    }
}

function tipoEvento(datos,id,mensaje) {
    if (datos.get(id) == 0){
        document.getElementById(id).insertAdjacentHTML('afterend', "<p class='text-danger remove-this'>"+mensaje+"</p>");
        return false;
    }else{
        return true;
    }
}

