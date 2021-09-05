import { Components, Options, PaginationComponent, PaginationItem } from '@splide/splide';
import { ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL } from '../../constants/attributes';
import { CLASS_ACTIVE } from '../../constants/classes';
import {
  EVENT_MOVE, EVENT_PAGINATION_MOUNTED,
  EVENT_PAGINATION_PAGE, EVENT_PAGINATION_UPDATED,
  EVENT_REFRESH,
  EVENT_SCROLLED,
  EVENT_UPDATED,
} from '../../constants/events';
import { Splide } from '../../core/Splide/Splide';
import { EventInterface } from '../../constructors';
import { addClass, ceil, create, empty, remove, removeAttribute, removeClass, setAttribute } from '../../utils';
import { format } from '../../utils/string';


/**
 * The component for handling previous and next arrows.
 *
 * @since 3.0.0
 *
 * @param Splide     - A Splide instance.
 * @param Components - A collection of components.
 * @param options    - Options.
 *
 * @return A Arrows component object.
 */
export function Pagination( Splide: Splide, Components: Components, options: Options ): PaginationComponent {
  const { on, emit, bind, unbind } = EventInterface( Splide );
  const { Slides } = Components;
  const { go, toPage, hasFocus, getIndex } = Components.Controller;

  /**
   * Stores all pagination items.
   */
  const items: PaginationItem[] = [];

  /**
   * The pagination element.
   */
  let list: HTMLUListElement;

  /**
   * Called when the component is mounted.
   */
  function mount(): void {
    init();
    on( [ EVENT_UPDATED, EVENT_REFRESH ], init );
    on( [ EVENT_MOVE, EVENT_SCROLLED ], update );
  }

  /**
   * Initializes the pagination.
   */
  function init(): void {
    destroy();

    if ( options.pagination && Slides.isEnough() ) {
      createPagination();
      emit( EVENT_PAGINATION_MOUNTED, { list, items }, getAt( Splide.index ) );
      update();
    }
  }

  /**
   * Destroys the component.
   */
  function destroy(): void {
    if ( list ) {
      remove( list );
      items.forEach( item => { unbind( item.button, 'click' ) } );
      empty( items );
      list = null;
    }
  }

  /**
   * Creates the pagination element and appends it to the slider.
   */
  function createPagination(): void {
    const { length } = Splide;
    const { classes, i18n, perPage } = options;
    const { slider, root } = Components.Elements;
    const parent = options.pagination === 'slider' && slider ? slider : root;
    const max    = hasFocus() ? length : ceil( length / perPage );

    list = create( 'ul', classes.pagination, parent );

    for ( let i = 0; i < max; i++ ) {
      const li       = create( 'li', null, list );
      const button   = create( 'button', { class: classes.page, type: 'button' }, li );
      const controls = Slides.getIn( i ).map( Slide => Slide.slide.id );
      const text     = ! hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;

      bind( button, 'click', () => { go( `>${ i }` ) } );

      setAttribute( button, ARIA_CONTROLS, controls.join( ' ' ) );
      setAttribute( button, ARIA_LABEL, format( text, i + 1 ) );

      emit( EVENT_PAGINATION_PAGE, list, li, button, i );

      items.push( { li, button, page: i } );
    }
  }

  /**
   * Returns the pagination item at the specified index.
   *
   * @param index - An index.
   *
   * @return A pagination item object if available, or otherwise `undefined`.
   */
  function getAt( index: number ): PaginationItem | undefined {
    return items[ toPage( index ) ];
  }

  /**
   * Updates the pagination status.
   */
  function update(): void {
    const prev = getAt( getIndex( true ) );
    const curr = getAt( getIndex() );

    if ( prev ) {
      removeClass( prev.button, CLASS_ACTIVE );
      removeAttribute( prev.button, ARIA_CURRENT );
    }

    if ( curr ) {
      addClass( curr.button, CLASS_ACTIVE );
      setAttribute( curr.button, ARIA_CURRENT, true );
    }

    emit( EVENT_PAGINATION_UPDATED, { list, items }, prev, curr );
  }

  return {
    items,
    mount,
    destroy,
    getAt,
  };
}