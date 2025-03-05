There are 23 Semantic UI settings objects in JQuery

### Index

Components: `calendar` <sup>c</sup>, `checkbox` <sup>c</sup>, `dropdown` <sup>c</sup>,
`form` <sup>c</sup>, `modal` <sup>c</sup>, `slider` <sup>c</sup>, `progress` <sup>c</sup>

Other elements: `popup`, `sticky`, `toast` <sup>fn</sup>

Planning to do: `dimmer` <sup>c</sup>, `embed`, `rating` <sup>c</sup>, `visibility`

Considering: `accordion`, `flyout`, `shape`, `sidebar`, `tab` &nbsp; _( containers )_

Not planned: `api`, `nag`, `site`, `search`, `state`, `transition`

## Implemented:

### <Init\*> tags

( after the input, may be placed after inside or around )

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

- rating <br>
  `<div class=ui rating></div>` <br/>
  `<InitRating settings={...} bind:value={...} />`

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

#### Display (read-only)

- progress <br>
  `<div class="ui progress"><div class="bar"><div class="progress"></div></div></div>` <br>
  `<InitProgress settings={...} value={...} total={100} />`

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

## Not yet implemented:

### Planning to do

- `visibility` : <div ... use:visibility={{ onTopVisible: ... }} />
- `embed` : <div ... use:embed={{ ... }} />
- `dimmer` : <InitDimmer bind:show={...} />

### Considering

- `accordion` : bind:open - number[ ]
- `sidebar` : bind:show
- `flyout` : bind:show - new, beta
- `shape` : 3D object, nextSide(selector, "up") - unusual
- `tab` : <InitTab bind:path={...} settings={...} />

## Not planned:

- `api`, `nag`, `search`, `state` - handle data/state in Svelte
- `transition` - use Svelte transitions
- `site` - configuration object
