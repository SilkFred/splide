<?php
function render( $id = 'splide01', $number = 10 ) {
  printf( '<div id="%s" class="splide">', $id );
  echo '<div class="splide__track">';
  echo '<ul class="splide__list">';
  for ( $i = 0; $i < $number; $i ++ ) {
    echo '<li class="splide__slide">';
    printf( '<img src="../../assets/images/pics/slide%02d.jpg">', $i + 1 );
    echo '</li>' . PHP_EOL;
  }
  echo '</ul>';
  echo '</div>';
  echo '</div>';
}