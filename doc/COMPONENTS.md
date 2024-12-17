# List of Semantic UI settings

There are 23 settings objects in JQuery:

## Implemented:

### <Init\*> tag

( after the input, may be inside or around )

#### Semantic UI components

- form <br/>
  `<form ckass="ui form">...</form>` <br/>
  `<InitForm bind:valid={..} settings={..} />`

- calendar <br/>
  `<div class=ui calendar>...</div>` <br/>
  `<InitCalendar value={..} settings={..} />`

- dropdown <br/>
  `<div class=ui dropdown>...</div>` <br/>
  `<InitDropdown value={..} settings={..} />`

- slider <br/>
  `<div class=ui slider>...</div>` <br/>
  `<InitSlider value={..} settings={..} />`

#### Inputs

- input <br/>
  `<input type="text" bind:value={..} />` ( text )<br/>
  `<InitNumberInput bind:value={..} />` ( number ) <br/>
  <br/>
  `<InitDateInput bind:value={..} />` ( Date ) <br/>
  `<InitTextInput bind:value={..} />` ( string ) <br/>

- checkbox <br/>
  `<input type="checkbox" bind:checked={..} />` <br/>
  `<InitCheckbox settings={..}` // TODO

### Modal

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

- accordion <br/>
  `open: number[]`

- dimmer <br/>
  `show() / hide()`

- flyout <br/>
  `show() / hide()` (beta)

- nag <br/>
  `show() / dismiss()`

- progress <br/>
  `value`

- rating <br/>
  `value`

- search <br/>
  `function()`

- shape <br/>
  `3D object`

- sidebar <br/>
  `show() / hide()`

- tab <br/>
  `path`

## Special:

- api
- embed
- site
- state
- transition
- visibility