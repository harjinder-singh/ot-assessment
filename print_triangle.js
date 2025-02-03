/**
 * @param {number} base
 * @param {number} height
 *
 * This function prints triangle with stars(*)
 * Assumtions:
 * 1) if height is 1 just base will be printed.
 * 2) if height > 1, first row will print only 1 star (To clearly show triangle vertex)
 * 3) This function is for printing right angled triangle.
 */
function printTriangle(base, height) {
  if (
    typeof base !== "number" ||
    typeof height !== "number" ||
    base < 0 ||
    height < 0
  ) {
    console.log("Only positive integers are accepted!!");
    return;
  }
  let stars = 0; //initilizing stars variable
  for (let i = 1; i <= height; i++) {
    /**
     * Printing either 1 star or number of stars = base
     * Based on fact that if we have height = 1 we have to print stars = base
     * Also if height > 1 then first row should show only 1 star to clearly show corner of traingle.
     **/
    if (i === 1 || i === height) {
      stars = i === height ? base : i;
    } else {
      //Calculation to see how many stars can be fitted at any point in the triangle.
      stars = Math.floor((i / height) * base);
    }
    //printig stars while looping over height
    console.log("* ".repeat(stars));
  }
}

printTriangle(4, 3); //Calling printTriangle with required arguments
