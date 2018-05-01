
package io.rong.message;

import android.os.Parcel;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import io.rong.common.ParcelUtils;
import io.rong.imlib.MessageTag;
import io.rong.imlib.model.MessageContent;

@MessageTag(value = "RC:DanMu", flag = 2)
public class DanMuMessage extends MessageContent {
  public DanMuMessage() {
  }
  public DanMuMessage(byte[] data) {
    String jsonStr = null;
    try {
        jsonStr = new String(data, "UTF-8");
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
    }
    try {
        JSONObject jsonObj = new JSONObject(jsonStr);
        
          if (jsonObj.has("content")){
            content = jsonObj.optString("content");
          }
        
          if (jsonObj.has("time")){
            time = jsonObj.optInt("time");
          }
        
          if (jsonObj.has("price")){
            price = jsonObj.optDouble("price");
          }
        
          if (jsonObj.has("isFinished")){
            isFinished = jsonObj.optBoolean("isFinished");
          }
        
    } catch (JSONException e) {
        e.printStackTrace();
    }
  }
  @Override
  public byte[] encode() {
    JSONObject jsonObj = new JSONObject();
    try {
        
            jsonObj.put("content", content);
        
            jsonObj.put("time", time);
        
            jsonObj.put("price", price);
        
            jsonObj.put("isFinished", isFinished);
        
    } catch (JSONException e) {
        e.printStackTrace();
    }
    try {
        return jsonObj.toString().getBytes("UTF-8");
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
    }
    return null;
  }
  @Override
  public int describeContents() {
    return 0;
  }
  @Override
  public void writeToParcel(Parcel dest, int flags) {
    
      
         ParcelUtils.writeToParcel(dest, content);
      
    
      
         ParcelUtils.writeToParcel(dest, time);
      
    
      
         ParcelUtils.writeToParcel(dest, price);
      
    
      
        ParcelUtils.writeToParcel(dest, isFinished ? 1 : 0);
      
    
  }
  protected DanMuMessage(Parcel in) {
    
      
        content = ParcelUtils.readFromParcel(in);
      
    
      
        
          time = ParcelUtils.readIntFromParcel(in);
        
      
    
      
        
          price = ParcelUtils.readDoubleFromParcel(in);
        
      
    
      
        
          isFinished = ParcelUtils.readIntFromParcel(in) != 0;
        
      
    
  }
  public static final Creator<DanMuMessage> CREATOR = new Creator<DanMuMessage>() {
    @Override
    public DanMuMessage createFromParcel(Parcel source) {
        return new DanMuMessage(source);
    }
    @Override
    public DanMuMessage[] newArray(int size) {
        return new DanMuMessage[size];
    }
  };
  
    private String content;
    public void setContent(   String  content) {
        content = content;
    }
    public String getContent() {
      return content;
    }
  
    private int time;
    public void setTime( int    time) {
        time = time;
    }
    public  int getTime() {
      return time;
    }
  
    private double price;
    public void setPrice( double    price) {
        price = price;
    }
    public  double getPrice() {
      return price;
    }
  
    private boolean isFinished;
    public void setIsFinished( boolean    isFinished) {
        isFinished = isFinished;
    }
    public  boolean getIsFinished() {
      return isFinished;
    }
  
}
