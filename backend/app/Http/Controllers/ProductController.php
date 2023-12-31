<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use OpenAI\API\Client;
use OpenAI\API\Exceptions\FailedRequestException;

class ProductController extends Controller
{
    
    public function index()
    {
        return Product::select('id','title','description','image')->get();
    }

   
    public function store(Request $request)
    {
        if (Auth::check()) {
            $request->validate([
                'title' => 'required',
                'image' => 'required|image'
            ]);
    
            try {
                $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('product/image', $request->image, $imageName);
    
                $description = $this->generateDescription($request->title);
    
                $product = new Product([
                    'title' => $request->title,
                    'description' => $description,
                    'image' => $imageName
                ]);
    
                $product->user_id = Auth::id();
                $product->save();
    
                return response()->json([
                    'message' => 'Product Created Successfully!!'
                ]);
            } catch (\Exception $e) {
                \Log::error($e->getMessage());
                return response()->json([
                    'message' => 'Something went wrong while creating a product!!'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }
    
    private function generateDescription($title)
    {
        $openai = new Client('OPENAI_API_KEY'); 
        $prompt = "Product: $title\nDescription:";
    
        try {
            $result = $openai->complete([
                'model' => 'text-davinci-003',
                'prompt' => $prompt,
                'max_tokens' => 100
            ]);
    
            return $result['choices'][0]['text'];
        } catch (FailedRequestException $e) {
            \Log::error($e->getMessage());
            return null;
        }
    }
    
  
    public function show(Product $product)
    {
        return response()->json([
            'product'=>$product
        ]);
    }

   
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'title'=>'required',
            'description'=>'required',
            'image'=>'nullable'
        ]);

        try{

            $product->fill($request->post())->update();

            if($request->hasFile('image')){

               
                if($product->image){
                    $exists = Storage::disk('public')->exists("product/image/{$product->image}");
                    if($exists){
                        Storage::disk('public')->delete("product/image/{$product->image}");
                    }
                }

                $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('product/image', $request->image,$imageName);
                $product->image = $imageName;
                $product->save();
            }

            return response()->json([
                'message'=>'Product Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a product!!'
            ],500);
        }
    }

   
    public function destroy(Product $product)
    {
        try {

            if($product->image){
                $exists = Storage::disk('public')->exists("product/image/{$product->image}");
                if($exists){
                    Storage::disk('public')->delete("product/image/{$product->image}");
                }
            }

            $product->delete();

            return response()->json([
                'message'=>'Product Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a product!!'
            ]);
        }
    }
}