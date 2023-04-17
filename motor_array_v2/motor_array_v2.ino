//initialize variables


#define NUM_MOTORS 6
int motorPins[] = {5, 11, 3, 10, 9, 6};
/*Motors arranged like this (by index):
    0 1
    2 3
    4 5
*/

String input_string = "";

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];
char SOLChar = '<';
char EOLChar   = '>';
char messageFromPC[numChars] = {0};
int integerFromPC = 0;
float floatFromPC = 0.0;

boolean newData = false;




//set up pins and serial
void setup() {
  for (int i = 0; i < NUM_MOTORS; i++) {
    pinMode(motorPins[i], OUTPUT);
    digitalWrite(motorPins[i], LOW);
  }

  Serial.begin(115200);
}

//continuously wait for serial messages from computer, and parse string
/*
   Protocol structure:
   input string format: "X Y"
   X is an int and indicates which motor's value to adjust
   Y is an int and indicates what speed to set that motor to
*/
void loop() {
  //test_motors();
  main_loop();
}



//**********TESTS BELOW*****************

//main loop. put in a function for modularity
void main_loop(){
  if (Serial.available() > 0) {
    char c = Serial.read();
    if (c != EOLChar) {
      input_string = input_string + c;
    }
    else {
      int powers[6];

      int motorIndex = 0;
      int index = 0;
      int start = 0;
      while (true) {
        if (input_string[index] == SOLChar) {
          start++;
          index++;
          continue;
        } else if (index == input_string.length()) {
          break;
        } else if (input_string[index] == ',') {
          int new_speed = input_string.substring(start, index).toInt();
          powers[motorIndex] = new_speed;

          motorIndex++;
          index++;
          start = index;
        } else {
          index++;
        }
      }
      for(int i = 0; i < NUM_MOTORS; i++){
        analogWrite(motorPins[i], powers[i]);
      }
      input_string = "";
      Serial.print("ack\n");
    }
  }
}


//put this test in loop()
void test_motors() {
  for (int i = 0; i < NUM_MOTORS; i++) {
    analogWrite(motorPins[i], 255);
    delay(3000);
    digitalWrite(motorPins[i], LOW);
  }
}

void left_test() {
  analogWrite(motorPins[0], 180);
  analogWrite(motorPins[1], 180);
  analogWrite(motorPins[3], 180);
  delay(3000);
  digitalWrite(motorPins[0], LOW);
  digitalWrite(motorPins[1], LOW);
  digitalWrite(motorPins[3], LOW);
}

//put this test in loop()
//prints i so you can approximate refresh rate. All the substring stuff is probably way too fast for humans to notice
void test_parse() {
  static int i = 0;

  String input_string = "1234 9876";
  int space_index = input_string.indexOf(' ');
  int motor = input_string.substring(0, space_index).toInt();
  int new_speed = input_string.substring(space_index + 1).toInt();

  Serial.print(motor); Serial.print(" "); Serial.print(new_speed); Serial.print(" "); Serial.println(i);
  i++;
}
