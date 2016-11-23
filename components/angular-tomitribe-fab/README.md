# angular-tomitribe-fab

Floating action button component

    * tribe-fab
        attributes:
            fab-direction='down/up/left/right' def['down']
            fab-trigger='fabClick/fabOver' def['fabClick']
            trigger-hide='true'
            opened-status='variable'

    * tribe-fab-trigger
    * tribe-fab-actions

    Ex:
      tribe-fab(fab-direction='down' fab-trigger='fabClick' opened-status='menuOneStatus')
        tribe-fab-trigger
          tribe-button(tribe-size='l', tribe-type='fab')
            span.alegreya.rt +
        tribe-fab-actions
          tribe-button(tribe-size='m', tribe-type='fab')
            i.fa.fa-android
            div.text Android
          tribe-button(tribe-size='m', tribe-type='fab')
            i.fa.fa-pencil
            div.text Pencil
          tribe-button(tribe-size='m', tribe-type='fab')
            i.fa.fa-remove
            div.text Remove