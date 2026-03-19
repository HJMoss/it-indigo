window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-content");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

$(document).ready(function () {

    $('#Calculate').click(function () {
        // Reset UI
        $('.error').text('');
        $('#ResultDisplay').text('');

        const weight = parseFloat($('#weight').val());
        const ageWeeks = parseInt($('#age').val());
        const activityLevel = $('input[name="activity"]:checked').val();

        let valid = true;

        if (isNaN(weight) || weight <= 0) {
            $('#weightError').text('Please enter a valid weight in grams');
            valid = false;
        }
        if (isNaN(ageWeeks) || ageWeeks <= 0) {
            $('#ageError').text('Please enter age in weeks');
            valid = false;
        }
        if (!activityLevel) {
            $('#activityError').text('Please select activity level');
            valid = false;
        }

        if (!valid) return;

        /*
           - Babies (under 12 weeks): Need more food for growth (~5-8% of body weight)
           - Adults: Maintenance (~3-5% of body weight)
           - Activity multiplier: High activity gets a 1.1x boost
        */
        
        let percentage = (ageWeeks < 12) ? 0.07 : 0.04; 
        let foodAmount = weight * percentage;

        if (activityLevel === "high") {
            foodAmount *= 1.1;
        }

        $('#ResultDisplay').text(`Suggested Daily Portion: ${foodAmount.toFixed(1)} grams`);
    });

    $('#Clear').click(function () {
        $('#hedgehogForm')[0].reset();
        $('.error').text('');
        $('#ResultDisplay').text('');
    });
});