int roodo=3;
int blauwo=5;
int groeno=6;
int rood=11;
int blauw=10;
int groen=9;

String data = "alarm hoog CO2 te hoog";
String vorigeData=" ";
String stad;
String bericht="hoog";
String desc;
    int regenblueishness1 = 100;
    int regenwhiteness1 = 100;
    int regenfadetimeblue = 10;
    int regenfadetimewhite = 30;
    String regenblauwstatus = "aftrekken";
    String regenwitstatus = "aftrekken";
    unsigned long regenvorige_wittijd = millis();
    unsigned long regenvorige_blauwtijd = millis();

 int sneeuwblueishness1 = 255;
     int sneeuwwhiteness1 = 255;
    int  sneeuwfadetimeblue =10;
     int sneeuwfadetimewhite = 20;
   String   sneeuwblauwstatus = "aftrekken";
    String  sneeuwwitstatus = "aftrekken";
      unsigned long  sneeuwvorige_wittijd = millis();
      unsigned long sneeuwvorige_blauwtijd = millis();

 int wolkwhiteness1 = 240;
 int    wolkfadetimewhite = 55;
 String   wolkwhitestatus = "aftrekken";
  unsigned long  wolkvorige_whitetijd = millis();

              int onweerblueishness1 = 80;
    int onweerwhiteness1 = random(0, 256);
    int onweerfadetimeblue = 40;
   int  onweerfadetimewhite = 22;
   String onweerblauwstatus = "aftrekken";
  String  onweerwitstatus = "optellen";
  unsigned long  onweervorige_wittijd = millis();
  unsigned long  onweervorige_blauwtijd = millis();

 int zonyellowness1 = 250;
   int  zonfadetimeyellow = 55;
    int zonyellowstatus = "aftrekken";
    
   unsigned long zonvorige_yellowtijd = millis();


          int     lichtblueishness1 = 5;
    int lichtwhiteness1 = 255;
   int  lichtfadetimeblue = 30;
    int lichtfadetimewhite = 30;
    String lichtblauwstatus = "optellen";
   String  lichtwitstatus = "aftrekken";
   unsigned long lichtvorige_wittijd = millis();
   unsigned long lichtvorige_blauwtijd = millis();
   unsigned long lichtvorige_zontijd = millis();
   int lichtzon = 2;
   #include <LiquidCrystal.h>
const int rs = 12, en = 13, d4 = 2, d5 = 4, d6 = 7, d7 = 8;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
void setup() {
  // put your setup code here, to run once:
Serial.begin(9600);
 lcd.begin(16, 2);
  lcd.print(bericht);
}

void loop() {
  // put your main code here, to run repeatedly:
if (Serial.available()>0){
  data=Serial.readString();
  
            analogWrite(rood,0);
              analogWrite(groen,0);
              analogWrite(blauw,0);
                analogWrite(roodo,0);
              analogWrite(groeno,0);
              analogWrite(blauwo,0);
             if(data!=vorigeData){
               if(data.indexOf("?")!=-1){
//  Serial.println(bericht2.substring(bericht2.indexOf(" ")+1));
int tweede_spatie=data.indexOf("?",data.indexOf("?")+1);
  int eerste_spatie=data.indexOf("?");
  stad=data.substring(0,eerste_spatie);
    bericht=data.substring(eerste_spatie+1,tweede_spatie);
    desc=data.substring(tweede_spatie+1);
  lcd.begin(16, 2);
    lcd.setCursor(0, 0);
  lcd.print(stad);
  lcd.setCursor(0, 1);
  lcd.print(desc);
 }
 else{
  lcd.begin(16, 2);
  
    lcd.setCursor(0, 0);
  lcd.print(data);
 }
            vorigeData=data; }

}
    if (bericht.substring(0, 1) == "3" or bericht.substring(0, 1) == "5"){
        if (regenwhiteness1 == 255){
            regenwitstatus = "aftrekken";
            }
        else if (regenwhiteness1 == 10){
            regenwitstatus = "optellen";
            }
        if (regenblueishness1 == 255){
            regenblauwstatus = "aftrekken";
            }
        else if (regenblueishness1 == 10){
            regenblauwstatus = "optellen";
            }
        if ((millis() - regenvorige_blauwtijd) >= regenfadetimeblue){ 
          analogWrite(blauwo,regenblueishness1);
            if (regenblauwstatus == "aftrekken"){
                regenblueishness1--;
                }
            else{
              regenblueishness1++;
              }
                
            regenvorige_blauwtijd = millis();
            }
         
        if ((millis() - regenvorige_wittijd) >= regenfadetimewhite){
          analogWrite(rood,regenwhiteness1);
          analogWrite(groen,regenwhiteness1);
          analogWrite(blauw,regenwhiteness1);
            if (regenwitstatus == "aftrekken"){
                regenwhiteness1--;
                }
            else{
              regenwhiteness1++;
              }
            regenvorige_wittijd = millis();
            }
            }  
       

       else if (bericht.substring(0, 1) == "6"){
          if (sneeuwwhiteness1 == 255){
              sneeuwwitstatus = "aftrekken";
}
          else if (sneeuwwhiteness1 == 10){
              sneeuwwitstatus = "optellen";
              }
          if (sneeuwblueishness1 == 255){
              sneeuwblauwstatus = "aftrekken";
              }
          else if( sneeuwblueishness1 == 10){
              sneeuwblauwstatus = "optellen";
              }
  
          if ((millis() - sneeuwvorige_blauwtijd) >= sneeuwfadetimeblue){
            analogWrite(roodo,sneeuwblueishness1);
              analogWrite(groeno,sneeuwblueishness1);
              analogWrite(blauwo,sneeuwblueishness1);
              if (sneeuwblauwstatus == "aftrekken"){
                  sneeuwblueishness1--;
                  }
              else{
                 sneeuwblueishness1++;
                 }
              
                 
              sneeuwvorige_blauwtijd = millis();
              }
              
          if ((millis() - sneeuwvorige_wittijd) >= sneeuwfadetimewhite){
            analogWrite(rood,sneeuwwhiteness1);
              analogWrite(groen,sneeuwwhiteness1);
              analogWrite(blauw,sneeuwwhiteness1);
              if (sneeuwwitstatus == "aftrekken"){
                
                  sneeuwwhiteness1--;
                  }
              else{
                sneeuwwhiteness1++;
                }
                  
              sneeuwvorige_wittijd = millis();
              }
              }
                
            else if (bericht.substring(0, 1) == "7" or bericht == "803" or bericht=="804"){
              
         if (wolkwhiteness1 == 255){
          
            wolkwhitestatus = "aftrekken";
          }
        
        else if( wolkwhiteness1 == 0){
          wolkwhitestatus = "optellen";
        }
            

        if ((millis() - wolkvorige_whitetijd) >= wolkfadetimewhite){
          analogWrite(rood,wolkwhiteness1);
            analogWrite(groen,wolkwhiteness1);
            analogWrite(blauw,wolkwhiteness1);
            analogWrite(roodo,255 - wolkwhiteness1);
            analogWrite(groeno,255- wolkwhiteness1);
            analogWrite(blauwo,255-wolkwhiteness1);
            if (wolkwhitestatus == "aftrekken"){
               wolkwhiteness1--;
            }
               
            else{
              wolkwhiteness1 ++;
            }
                
            wolkvorige_whitetijd = millis();
            }
        }
            

            
            else if (bericht.substring(0, 1)== "2")
            {
              if (onweerblueishness1 >= 230){
          
            onweerblauwstatus = "aftrekken";
         }
        else if (onweerblueishness1 <= 8){
          
            onweerblauwstatus = "optellen";
        }
        if ((millis()- onweervorige_blauwtijd) >= onweerfadetimeblue){
           analogWrite(blauw,onweerblueishness1);
            if (onweerblauwstatus == "aftrekken"){
              
                onweerblueishness1=onweerblueishness1-2;
              }
            else{
                onweerblueishness1=onweerblueishness1+2;
                }
              
            onweervorige_blauwtijd = millis();
            }
           
        if ((millis() - onweervorige_wittijd) >= onweerfadetimewhite){
            int onweerstart = random(1, 8);
           int  onweerstop = random(1, 100);
            if (onweerstop == 1){
              if (onweerstart == 1){
                    onweerwitstatus = "optellen";
                    }
                if (onweerstart == 2){
                  
                    onweerwitstatus = "aftrekken";
                    }
                if (onweerstart == 3){
                  onweerwhiteness1 = random(200, 256);
                    if (onweerwhiteness1 < 128){
                        onweerwitstatus = "aftrekken";
                        }
                    else{
                      onweerwitstatus = "optellen";
                      }
                        
                  }
                    
}
                
            analogWrite(roodo,onweerwhiteness1);
            analogWrite(groeno,onweerwhiteness1);
            analogWrite(blauwo,onweerwhiteness1);
            if (onweerwitstatus == "aftrekken" and onweerwhiteness1 <= 4){
              
                onweerwhiteness1=onweerwhiteness1-4;
                }
            else if (onweerwitstatus == "optellen" and onweerwhiteness1 <= 250){
              
                onweerwhiteness1=onweerwhiteness1-4;
            }
            onweervorige_wittijd =millis();
            }
            }
               
            else if (bericht == "800"){
       if (zonyellowness1 >= 250){
          
            zonyellowstatus = "aftrekken";
        }
        else if (zonyellowness1 <=5){
          
            zonyellowstatus = "optellen";
        }

        if ((millis() - zonvorige_yellowtijd) >= zonfadetimeyellow){
          
            analogWrite(groen,(zonyellowness1 / 5));
            analogWrite(rood,zonyellowness1);
            analogWrite(groeno,(255 - zonyellowness1)/ 5);
            analogWrite(roodo,255 - zonyellowness1);
            if (zonyellowstatus == "aftrekken"){
                              zonyellowness1 = zonyellowness1 - 2;

            }
            else{
                              zonyellowness1 = zonyellowness1 + 2;

            }
            zonvorige_yellowtijd = millis();
                    }
        }
                    
           
                   
            else if (bericht == "801" or bericht=="802"){
            if (lichtwhiteness1 >= 250){
          lichtwitstatus = "aftrekken";
        }
        else if (lichtwhiteness1 <= 10){
           lichtwitstatus = "optellen";
        }
           
        if (lichtblueishness1 >= 250){
          
            lichtblauwstatus = "aftrekken";
        }
        else if (lichtblueishness1 <= 5){
          
             lichtzon = random(1,4);
            lichtblauwstatus = "optellen";
        }

        if ((millis()- lichtvorige_blauwtijd) >= lichtfadetimeblue){
          if (lichtzon == 1){
             analogWrite(rood,lichtblueishness1);
                analogWrite(groen,lichtblueishness1 / 5);
                analogWrite(blauw,0);
          }
               
            else{
               analogWrite(rood,lichtblueishness1);
                analogWrite(groen,lichtblueishness1);
                analogWrite(blauw,lichtblueishness1);
            }
               

            if (lichtblauwstatus == "aftrekken"){
                lichtblueishness1 = lichtblueishness1 - 2;
            }
            else{
               lichtblueishness1 = lichtblueishness1 + 2;
            }
            lichtvorige_blauwtijd = millis();
        }
            
        if ((millis() - lichtvorige_wittijd) >= lichtfadetimewhite){
          analogWrite(roodo,lichtwhiteness1);
           analogWrite( groeno,lichtwhiteness1);
            analogWrite(blauwo,lichtwhiteness1);
            if (lichtwitstatus == "aftrekken"){
              lichtwhiteness1 = lichtwhiteness1 - 2;
            }
                
            else{
             
                lichtwhiteness1 = lichtwhiteness1 + 2; 
            }
            lichtvorige_wittijd = millis();
        }
            
}

 else if (bericht == "hoog"){
    delay(500);
    analogWrite(rood, 255);
    analogWrite(blauwo, 255);
   analogWrite(roodo, 0);
    analogWrite(blauw, 0);
    delay(500);
    analogWrite(rood, 0);
    analogWrite(roodo, 255);
    analogWrite(blauw, 255);
    analogWrite(blauwo, 0);
    }
}
