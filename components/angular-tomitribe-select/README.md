# angular-tomitribe-select

Directives to use in ui-select.

    * tribe-activate-hover
        This directive set the option active, when the mouseenter event is fired.

     Ex:
        ui-select-choices(repeat="role in availableRoles")
            div(tribe-activate-hover="role")
              span {{role.name}}

    * tribe-select-open-on-focus
            This directive set the select active, on focus (tab)
            Based on https://github.com/angular-ui/ui-select/issues/428

         Ex:
            ui-select(tribe-select-open-on-focus)