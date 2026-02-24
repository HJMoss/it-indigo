$(document).ready(function () {

    $('#Calculate').click(function () {
        $('.error').text('');
        $('#ToValue').val('');

        const fromValue = $('#FromValue').val().trim();
        const fromUnit = $('input[name="FromUnit"]:checked').val();
        const toUnit = $('input[name="ToUnit"]:checked').val();

        let valid = true;

        if (fromValue === '' || isNaN(fromValue)) {
            $('#FromValueMsg').text('Value is required and must be a number');
            valid = false;
        }
        if (!fromUnit) {
            $('#FromUnitMsg').text('From unit is required');
            valid = false;
        }
        if (!toUnit) {
            $('#ToUnitMsg').text('To unit is required');
            valid = false;
        }
        if (!valid) return;

        $.ajax({
            url: 'https://brucebauer.info/assets/ITEC3650/unitsconversion.php',
            type: 'GET',
            data: { FromValue: fromValue, FromUnit: fromUnit, ToUnit: toUnit },
            success: function (result) {
                $('#ToValue').val(result);
            },
            error: function () {
                $('#ToValue').val('Error retrieving conversion');
            }
        });
    });

    $('#Clear').click(function () {
        $('#myform')[0].reset();
        $('.error').text('');
        $('#ToValue').val('');
    });

});