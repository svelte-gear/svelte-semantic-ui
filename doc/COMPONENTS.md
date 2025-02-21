There are 23 Semantic UI settings objects in JQuery

## Implemented:

### <Init\*> tag

( after the input, may be inside or around )

#### Semantic UI components

- form <br/>
  `<form class="ui form">...</form>` <br/>
  `<InitForm bind:valid={..} settings={..} />`

- calendar <br/>
  `<div class=ui calendar>...</div>` <br/>
  `<InitCalendar value={..} settings={..} />` ( Date | undefined )

- dropdown <br/>
  `<div class=ui dropdown>...</div>` <br/>
  `<InitDropdown value={..} settings={..} />` ( string | string[] | undefined )

- slider <br/>
  `<div class=ui slider>...</div>` <br/>
  `<InitSlider value={..} settings={..} />` ( number | number[] )

#### Inputs

- input <br/>
  `<input type="text" />` ( text )<br/>
  `<InitNumberInput bind:value={..} />` ( number ) <br/>
  <br/>
  `<input type="text" />` ( text )<br/>
  `<InitDateInput bind:value={..} />` ( Date ) <br/>
  <br/>
  `<input type="text" />` ( text )<br/>
  `<InitTextInput bind:value={..} />` ( string | string[] ) <br/>

- checkbox <br/>
  `<input type="checkbox" />` <br/>
  `<InitCheckbox settings={..} bind:group={...} />` ( string | string[] )

#### Modal

- modal <br/>
  `<div class="ui modal>...</div>`
  `<InitModal show={..} settings={..}>`

### use: action

- popup <br/>
  `<div use:popup={settings}>...</div>`

- sticky <br/>
  `<div use:sticky={settings}>...</div>`

### function

- toast <br/>
  `<script> toast(settings); </script>`

## Have settings, not yet implemented:

- accordion &mdash; `open: number[]`

- dimmer &mdash; `show() / hide()`

- flyout &mdash; `show() / hide()` &nbsp; (beta)

- nag &mdash; `show() / dismiss()`

- progress &mdash; `value`

- rating &mdash; `value`

- search &mdash; `function()`

- shape &mdash; `3D object`

- sidebar &mdash; `show() / hide()`

- tab &mdash; `path`

## Special:

- api
- embed
- site
- state
- transition
- visibility
